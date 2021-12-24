import { BadRequestException, Injectable } from "@nestjs/common";
import { EventService } from "../event/event.service";
import { EventTicket, EventTicketPurchase } from "../event/schemas/event-ticket.schema";
import { EventPurchaseItem, TicketPurchaseRequestDTO } from "./dtos/ticket_purchase.dto";



@Injectable()
export class TicketPurchaseHelper {

  constructor(
    private eventService: EventService
  ) { }

  async validatePurchases(details: TicketPurchaseRequestDTO) {
    // check if event is valid
    // check if all tickets selected are valid
    const event = await this.eventService.getEvent(details.eventId);

    if (event.status !== 'ACTIVE') { // Check if date is passed
      throw new BadRequestException('Tickets for this event cannnot be bought at this time');
    }

    const ticketsAreValid = details.purchases.every(purchase => {
      const ticketExists = event.tickets.find(ticket => purchase.ticketId === ticket.id);
      return ticketExists !== undefined;
    });

    if (!ticketsAreValid) {
      throw new BadRequestException('One more tickets selected are invalid');
    }

  }

  async formatRawPurchases(eventId: string, purchases: EventPurchaseItem[]): Promise<EventTicketPurchase[]> {
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
        pricePerUnit: price
      }
    });

    return ticketPurchaseData;
  }

  calculateCostOfPurchase(purchases: EventTicketPurchase[]) {
    let total = 0;

    purchases.forEach(purchase => {
      total += purchase.pricePerUnit * purchase.amountToPurchase
    })

    return total;
  }
}