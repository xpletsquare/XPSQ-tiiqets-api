import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class BankDetails {
  @Prop()
  id: string;

  @Prop()
  user: string;

  @Prop({ required: false })
  accountNumber: number;

  @Prop({ required: false })
  accountName: string;

  @Prop({ default: "none" })
  accountType: "savings" | "current" | "none";
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);
export type BankDetailDocument = Document & BankDetails;
