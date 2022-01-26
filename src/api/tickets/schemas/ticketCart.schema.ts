import { Prop, Schema } from "@nestjs/mongoose";
import { TicketUnit } from "./ticketUnit.schema";


@Schema({ timestamps: true })
export class TicketCart {
  @Prop()
  id: string

  @Prop()
  ownerId: string;

  @Prop()
  items: Partial<TicketUnit>[]

  @Prop()
  total: number
}