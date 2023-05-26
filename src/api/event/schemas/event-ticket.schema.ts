import { SchemaFactory } from "@nestjs/mongoose";
import { IEventSchedule } from "../../../interfaces";

export class EventTicket {
  id: string;

  eventId: string;

  name: string;

  title?: string;

  description: string;

  price: number;

  nLimit: number;

  nSold: number;

  maxPurchases: number;

  endSalesAt: number;

  schedule: string | IEventSchedule; // Uses the scehedule name
}

export const TicketSchema = SchemaFactory.createForClass(Event);

export class EventTicketPurchase {
  id: string;

  eventId: string;

  name: string;

  description: string;

  pricePerUnit: number;

  amountToPurchase: number;

  labels: string[];
}

export class EventTicketUpdate {
  name: string;
  description: string;
  price: number;
}
