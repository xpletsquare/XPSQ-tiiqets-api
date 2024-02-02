import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class WithdrawalRequest {
  @Prop()
  id: string;

  @Prop()
  user: string;

  @Prop()
  amount: number;

  @Prop()
  status: "pending-review" | "pending" | "fulfilled" | "declined" | "failed";

  @Prop()
  adminHandler: string;

  @Prop()
  withdrawalReference: string;

  @Prop()
  statusUpdatedAt: Date;
}

export const WithdrawalRequestSchema =
  SchemaFactory.createForClass(WithdrawalRequest);
export type WithdrawalDocument = Document & WithdrawalRequest;

export enum WithdrawalRequestStatus {
  PENDING_REVIEW = "pending-review",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  DECLINED = "declined",
  FAILED = "failed"
}
