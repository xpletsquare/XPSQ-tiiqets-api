import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EventTicketPurchase } from "src/api/event/schemas/event-ticket.schema";
import { EventPurchaseItem } from "../dtos/ticket_purchase.dto";

export interface Posters {
  landscape?: string;
  portrait?: string;
}
export interface TicketPurchased {
  id: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  label: string;
  type: string;
  price: number;
  purchaseRef: string;
  event: {
    id: string;
    title: string;
    image?: Posters;
    venue: string;
    date: string;
  };
}

@Schema({ timestamps: true })
export class TicketPurchase extends Document {
  @Prop({ required: true })
  id: string;

  @Prop()
  eventId: string;

  @Prop({ required: true })
  ticketSummary: EventTicketPurchase[] | EventPurchaseItem[];

  @Prop()
  tickets: TicketPurchased[];

  @Prop({ default: 0.0 })
  cost: number;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ default: 0.0 })
  refundAmount: number;

  @Prop({ default: false })
  refunded: boolean;

  @Prop({ index: true })
  paymentRef: string;

  @Prop()
  promoterCode: string;

  @Prop()
  userEmail: string;

  @Prop()
  userFirstName: string;

  @Prop()
  userLastName: string;

  @Prop({ default: null })
  paymentDate: string;
}

export type TicketPurchaseDocument = Document & TicketPurchase;
export const TicketPurchaseSchema =
  SchemaFactory.createForClass(TicketPurchase);
