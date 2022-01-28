import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({ timestamps: true })
export class Wallet {

  @Prop()
  id: string;

  @Prop()
  user: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  ledgerBalance: number;

  @Prop()
  bankDetailsId: string

  @Prop({ default: false })
  locked: boolean;

}

export type WalletDocument = Document & Wallet;
export const WalletSchema = SchemaFactory.createForClass(Wallet);