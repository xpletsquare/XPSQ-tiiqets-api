import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class BankDetails {
  @Prop()
  id: string;

  @Prop()
  user: string;

  @Prop({ required: true })
  accountNumber: number;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  bankCode: string;

  @Prop({ default: "none" })
  accountType: "savings" | "current" | "none";

  @Prop()
  recipient: string;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);
export type BankDetailDocument = Document & BankDetails;
