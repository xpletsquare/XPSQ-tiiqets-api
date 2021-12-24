import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventTicket } from 'src/api/event/schemas/event-ticket.schema';
import { EventPurchaseItem } from '../dtos/ticket_purchase.dto';

@Schema({ timestamps: true })
export class TicketPurchase extends Document {
  @Prop({ required: true })
  id: string;

  @Prop()
  eventId: string;

  @Prop({ required: true })
  purchases: EventTicket[] | EventPurchaseItem[];

  @Prop({ default: 0.0 })
  cost: number;

  @Prop({ default: false })
  paid: boolean;

  @Prop()
  paymentRef: number;

  @Prop()
  userEmail: string;

  @Prop({ default: null })
  paymentDate: string;
}

export type TicketPurchaseDocument = Document & TicketPurchase;
export const TicketPurchaseSchema = SchemaFactory.createForClass(TicketPurchase);
