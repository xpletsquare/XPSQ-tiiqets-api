

export class EventTicket {

  id: string;

  eventId: string;

  name: string;

  description: string;

  price: number;

  availableTickets: number;

  maxPossiblePurchases: number

  endSalesAt: number;

}

export class EventTicketUpdate {
  name: string;
  description: string;
  price: number;
}
