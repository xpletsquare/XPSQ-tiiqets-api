import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventTicket } from './event-ticket.schema';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop()
  startsAt: number; // Timestamp

  @Prop()
  endsAt: number; // Timestamp

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: [], type: [Object] })
  tickets: EventTicket[];

  @Prop()
  category: string;

  @Prop()
  status: string; // draft, active, passed, inactive, canceled

  @Prop()
  tags: string[]

  @Prop()
  user_id: string;

  toDto(): Partial<Event> {
    return
  }
}

export type EventDocument = Document & Event;
export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.methods.toDto = function () {
  const { id, title, venue, date, startsAt, endsAt, description, image, tickets, category, tags, user_id } = this;
  return { id, title, venue, date, startsAt, endsAt, description, image, tickets, category, tags, user_id };
}