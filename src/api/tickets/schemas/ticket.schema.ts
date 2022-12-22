import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class EventTicket {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  eventId: string;

  @Prop()
  price: number;
}

export const EventTicketSchema = SchemaFactory.createForClass(EventTicket);

export type EventTicketDocument = Document & EventTicket;
