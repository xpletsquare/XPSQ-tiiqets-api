import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IEventSchedule } from "src/interfaces";
import { Timestamp } from "src/utilities";
import { EventTicket } from "./event-ticket.schema";

// export enum EventStatus = 'DRAFT' | 'ACTIVE' | 'PASSED' | 'INACTIVE' | 'CANCELED' | string;
export enum EventStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PASSED = "INACTIVE",
  CANCELED = "CANCELED",
}

interface EventImage {
  landscape: string;
  portrait: string;
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true, index: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true })
  startDate: Timestamp;

  @Prop({ required: true })
  endDate: Timestamp;

  @Prop({ required: true, default: [], type: [Object] })
  schedules: IEventSchedule[];

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Object })
  image: EventImage;

  @Prop({ default: [], type: [Object] })
  tickets: EventTicket[];

  @Prop()
  category: string;

  @Prop({
    enum: ["DRAFT", "ACTIVE", "PASSED", "INACTIVE", "CANCELED"],
    default: "DRAFT",
  })
  status: EventStatus; // draft, active, passed, inactive, canceled

  @Prop()
  tags: string[];

  @Prop()
  author: string;

  toDto: () => Partial<Event>;

  findTicket: (id: string) => EventTicket;

  canBuyTicketAmount: (amount: number, ticketId: string) => Promise<boolean>;

  updateTicketCount: (amount: number, ticketId: string) => Promise<boolean>;
}

export type EventDocument = Document & Event;
export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.methods.toDto = function () {
  const {
    id,
    title,
    location,
    date,
    status,
    startDate,
    endDate,
    description,
    image,
    tickets,
    schedules,
    category,
    tags,
    author,
    venue,
  } = this as any;
  return {
    id,
    title,
    location,
    date,
    status,
    startDate,
    endDate,
    description,
    image,
    tickets,
    schedules,
    category,
    tags,
    author,
    venue,
  };
};

EventSchema.methods.findTicket = function (ticketId: string): EventTicket {
  const { tickets } = this as any;
  const ticket = tickets.find((ticket) =>
    [ticket.id, ticket.name].includes(ticketId)
  );
  return ticket || null;
};

EventSchema.methods.canBuyTicketAmount = function (
  amount: number,
  ticketId: string
): boolean {
  const ticket: EventTicket = this.findTicket(ticketId);

  const available = ticket.nLimit - ticket.nSold;

  if (!ticket) {
    return false;
  }

  return available >= amount;
};

EventSchema.methods.updateTicketSoldCount = async function (
  amount: number,
  ticketId: string
) {
  const ticket = this.findTicket(ticketId);

  const tickets = [...this.tickets];

  ticket.nSold = ticket.nSold + amount;

  const index = tickets.findIndex((data) => data.id === ticketId);

  tickets[index] = ticket;
  await this.update({ tickets });
  return true;
};
