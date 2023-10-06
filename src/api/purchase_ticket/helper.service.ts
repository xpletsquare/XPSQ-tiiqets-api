import { BadRequestException, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { generateId, generatePaymentRef } from "src/utilities";
import { EventService } from "../event/event.service";
import { EventTicketPurchase } from "../event/schemas/event-ticket.schema";
import {
  EventPurchaseItem,
  TicketPurchaseRequestDTO,
} from "./dtos/ticket_purchase.dto";
import { TicketPurchase } from "./schemas/ticket_purchase.schema";
import { NUMBERS } from "../../constants";

@Injectable()
export class TicketPurchaseHelper {
  constructor(
    private eventService: EventService,
    private eventEmitter: EventEmitter2
  ) {}

  async validateTicketPurchases(details: TicketPurchaseRequestDTO) {
    const event = await this.eventService.getEvent(details.eventId);

    if (event.status !== "ACTIVE") {
      // Check if date is passed
      throw new BadRequestException(
        "Tickets for this event cannnot be bought at this time"
      );
    }

    const ticketsAreValid = details.purchases.every(purchase => {
      const ticket = event.tickets.find(
        (ticket) => purchase.ticketId === ticket.id
      );

      if (!ticket) {
        return false;
      }

      const canPurchaseWantedAmount = ticket.maxPurchases >= purchase.count;
      const available = ticket.nLimit - ticket.nSold;
      const ticketNumbersAreAvailable = available >= purchase.count;

      console.log({ ticket, canPurchaseWantedAmount, available, ticketNumbersAreAvailable });
      return ticketNumbersAreAvailable && canPurchaseWantedAmount;
    });

    if (!ticketsAreValid) {
      throw new BadRequestException(
        "please check tickets and the requested quantities"
      );
    }
  }

  async getTicketsSummaryForPurchase(
    eventId: string,
    purchases: EventPurchaseItem[]
  ): Promise<EventTicketPurchase[]> {
    const event = await this.eventService.getEvent(eventId);

    const ticketPurchaseData: EventTicketPurchase[] = purchases.map(
      (purchase) => {
        const ticketDetails = event.findTicket(purchase.ticketId);
        const { id, name, description, price, eventId } = ticketDetails;

        return {
          id,
          name,
          description,
          eventId,
          userEmail: purchase.userEmail,
          userFirstName: purchase.userFirstName,
          userLastName: purchase.userLastName,
          amountToPurchase: purchase.count,
          pricePerUnit: price,
          labels: purchase.labels,
        };
      }
    );

    console.log({ ticketPurchaseData });

    return ticketPurchaseData;
  }

  async createTempTicketPurchase(purchaseData: TicketPurchaseRequestDTO) {
    const ticketSummary = await this.getTicketsSummaryForPurchase(
      purchaseData.eventId,
      purchaseData.purchases
    );

    const cost = this.calculateCostOfPurchase(ticketSummary);
    const ticketPurchase: Partial<TicketPurchase> = {
      id: generateId(),
      cost,
      paymentRef: generatePaymentRef() + "",
      paymentDate: new Date().toISOString(),
      paid: cost === NUMBERS.Zero,
      ticketSummary,
      eventId: purchaseData.eventId,
      userEmail: purchaseData.userEmail,
      userFirstName: purchaseData.userFirstName,
      userLastName: purchaseData.userLastName,
      promoterCode: purchaseData.promoterCode || null,
    };

    return ticketPurchase;
  }

  async generateTicketData(
    eventId: string,
    ticketSummary: EventTicketPurchase,
    purchaseRef: string,
    userEmail: string
  ) {
    const event = await this.eventService.getEvent(eventId);
    const canBuyTickets = await event.canBuyTicketAmount(
      ticketSummary.amountToPurchase,
      ticketSummary.id
    );

    if (!canBuyTickets) {
      console.log("insufficient ticket quantity");
      this.eventEmitter.emit("initiate.ticket.refund", {
        ticketSummary,
        purchaseRef,
        userEmail,
      });
      return [];
    }

    const updated = await event.updateTicketCount(
      ticketSummary.amountToPurchase,
      ticketSummary.id
    );

    if (!updated) {
      console.log("event ticket count update failed");
      return [];
    }

    const labels = ticketSummary.labels || [];

    const getDateForTicket = () => {
      const ticketData = event.findTicket(ticketSummary.id);
      const schedule = event.schedules.find(
        (schedule) => {
          if (typeof ticketData.schedule === 'string') {
            return schedule.name.toLowerCase() === ticketData.schedule.toLowerCase();
          }

          return schedule.name.toLowerCase() === ticketData.schedule.name.toLowerCase();
        }
      );

      return schedule.date;
    };

    const generatedTickets = [];

    for (let index = 0; index < ticketSummary.amountToPurchase; index++) {
      const ticket = {
        id: generateId(),
        userEmail: ticketSummary.userEmail,
        userFirstName: ticketSummary.userFirstName,
        userLastName: ticketSummary.userLastName,
        label: labels[index] || "",
        type: ticketSummary.name,
        price: ticketSummary.pricePerUnit,
        purchaseRef,
        event: {
          id: event.id,
          title: event.title,
          image: event.image,
          venue: event.venue,
          date: getDateForTicket(),
        },
      };

      generatedTickets.push(ticket);
    }

    return generatedTickets;
  }

  calculateCostOfPurchase(purchases: EventTicketPurchase[]) {
    let total = 0;

    purchases.forEach((purchase) => {
      total += purchase.pricePerUnit * purchase.amountToPurchase;
    });

    return total;
  }
}
