import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventTicket } from './event-ticket.schema';

// export enum EventStatus = 'DRAFT' | 'ACTIVE' | 'PASSED' | 'INACTIVE' | 'CANCELED' | string;
export enum EventStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PASSED = 'INACTIVE',
  CANCELED = 'CANCELED',
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true, type: Date })
  date: Date | string;

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

  @Prop({ enum: ['DRAFT', 'ACTIVE', 'PASSED', 'INACTIVE', 'CANCELED'], default: 'DRAFT' })
  status: EventStatus; // draft, active, passed, inactive, canceled

  @Prop()
  tags: string[]

  @Prop()
  author: string;

  toDto(): Partial<Event> {
    return
  }

  findTicket(id: string): EventTicket {
    return;
  }
}

export type EventDocument = Document & Event;
export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.methods.toDto = function () {
  const { id, title, venue, date, status, startsAt, endsAt, description, image, tickets, category, tags, author } = this as any;
  return { id, title, venue, date, status, startsAt, endsAt, description, image, tickets, category, tags, author };
}

EventSchema.methods.findTicket = function (ticketId: string): EventTicket {
  const { tickets } = this as any;
  const ticket = tickets.find(ticket => [ticket.id, ticket.name].includes(ticketId));
  return ticket || null;
}