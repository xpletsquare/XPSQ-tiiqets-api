import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class EventWallet {
  @Prop()
  id: string;

  @Prop()
  event: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: false })
  paidOut: boolean;
}

export type EventWalletDocument = Document & EventWallet;
export const EventWalletSchema = SchemaFactory.createForClass(EventWallet);
