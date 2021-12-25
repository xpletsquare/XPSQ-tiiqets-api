import { BadRequestException, Injectable } from "@nestjs/common";
import { generateId, generatePaymentRef } from "src/utilities";
import { EventService } from "../event/event.service";
import { EventTicketPurchase } from "../event/schemas/event-ticket.schema";
import { EventPurchaseItem, TicketPurchaseRequestDTO } from "./dtos/ticket_purchase.dto";
import { TicketPurchase } from "./schemas/ticket_purchase.schema";



@Injectable()
export class TicketPurchaseHelper {

  constructor(
    private eventService: EventService
  ) { }

  async validateTicketPurchases(details: TicketPurchaseRequestDTO) {
    const event = await this.eventService.getEvent(details.eventId);

    if (event.status !== 'ACTIVE') { // Check if date is passed
      throw new BadRequestException('Tickets for this event cannnot be bought at this time');
    }

    const ticketsAreValid = details.purchases.every(purchase => {
      const ticket = event.tickets.find(ticket => purchase.ticketId === ticket.id);

      if (!ticket) {
        return false
      }

      const canPurchaseWantedAmount = ticket.maxPossiblePurchases >= purchase.count;
      const ticketNumbersAreAvailable = ticket.availableTickets >= purchase.count;

      return ticketNumbersAreAvailable && canPurchaseWantedAmount;
    });

    if (!ticketsAreValid) {
      throw new BadRequestException('please check tickets and the requested quantities');
    }

  }

  async getTicketsSummaryForPurchase(eventId: string, purchases: EventPurchaseItem[]): Promise<EventTicketPurchase[]> {
    // id, unitPrice, count, name, 
    const event = await this.eventService.getEvent(eventId);

    const ticketPurchaseData: EventTicketPurchase[] = purchases.map(purchase => {
      const ticketDetails = event.findTicket(purchase.ticketId);

      const { id, name, description, price, eventId } = ticketDetails;

      return {
        id,
        name,
        description,
        eventId,
        amountToPurchase: purchase.count,
        pricePerUnit: price,
        labels: purchase.labels
      }
    });

    return ticketPurchaseData;
  }

  async createTempTicketPurchase(purchaseData: TicketPurchaseRequestDTO) {
    const ticketSummary = await this.getTicketsSummaryForPurchase(purchaseData.eventId, purchaseData.purchases);
    const cost = this.calculateCostOfPurchase(ticketSummary);

    const ticketPurchase: Partial<TicketPurchase> = {
      id: generateId(),
      cost,
      paymentRef: generatePaymentRef() + '',
      paymentDate: new Date().toISOString(),
      paid: false,
      ticketSummary,
      eventId: purchaseData.eventId,
      userEmail: purchaseData.userEmail,
      promoterCode: purchaseData.promoterCode || null
    }

    return ticketPurchase;
  }

  async generateTicketData(eventId: string, ticketSummary: EventTicketPurchase, purchaseRef: string, userEmail: string) {
    const event = await this.eventService.getEvent(eventId);
    const labels = ticketSummary.labels || [];

    const generatedTickets = [];

    for (let index = 0; index < ticketSummary.amountToPurchase; index++) {
      const ticket = {
        id: generateId(),
        userEmail,
        label: labels[index] || '',
        type: ticketSummary.name,
        price: ticketSummary.pricePerUnit,
        purchaseRef,
        event: {
          id: event.id,
          title: event.title,
          image: event.image,
          venue: event.venue,
          date: event.date
        }
      };

      generatedTickets.push(ticket);
    }

    return generatedTickets;
  }

  calculateCostOfPurchase(purchases: EventTicketPurchase[]) {
    let total = 0;

    purchases.forEach(purchase => {
      total += purchase.pricePerUnit * purchase.amountToPurchase
    })

    return total;
  }


}