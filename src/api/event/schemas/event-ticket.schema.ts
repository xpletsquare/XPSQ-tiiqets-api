

export class EventTicket {

  id: string;

  eventId: string;

  name: string;

  description: string;

  price: number;

  nLimit: number;

  nSold: number;

  maxPurchases: number

  endSalesAt: number;

}

export class EventTicketPurchase {

  id: string;

  eventId: string;

  name: string;

  description: string;

  pricePerUnit: number;

  amountToPurchase: number

  labels: string[]

}

export class EventTicketUpdate {
  name: string;
  description: string;
  price: number;
}
