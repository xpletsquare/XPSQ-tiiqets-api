import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class WithdrawalRequest {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  amount: number;

  @Prop()
  status: "pending" | "approved" | "declined";
}

export const WithdrawalRequestSchema =
  SchemaFactory.createForClass(WithdrawalRequest);
export type WithdrawalDocument = Document & WithdrawalRequest;
