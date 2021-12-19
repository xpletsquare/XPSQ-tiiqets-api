import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TicketPurchase extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  purchases: {
    event_id: string;
    tickets: { id: string; name: string; price: number; count: number }[];
  }[];

  @Prop({ default: 0.0 })
  cost: number;

  @Prop({ default: false })
  paid: boolean;

  @Prop()
  user_id: string;

  @Prop({ default: null })
  payment_date: string;
}

export type TicketPurchaseDocument = Document & TicketPurchase;
export const TicketPurchaseSchema = SchemaFactory.createForClass(Event);
