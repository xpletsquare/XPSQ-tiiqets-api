import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { getQRCode } from "src/utilities";

@Schema({ timestamps: true })
export class TicketUnit extends Document {
  @Prop()
  id: string; // Unique 8 digits

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: "REGULAR" })
  category: string;

  @Prop()
  used: boolean;

  @Prop()
  eventId: string;

  @Prop({ default: "none" })
  ownerTag: string;

  getQRCode(): Promise<string> {
    return;
  } // implemented in schema methods
}

export type TicketUnitDocument = Document & TicketUnit;
export const TicketUnitSchema = SchemaFactory.createForClass(TicketUnit);

TicketUnitSchema.methods.getQRCode = async function () {
  const { id, used, eventId, ownerTag } = this as TicketUnitDocument;

  const dataToEncode = {
    ticketId: id,
    used: used,
    eventId: eventId,
    ownerTag: ownerTag,
  };

  const qrcode = await getQRCode(dataToEncode);

  return qrcode;
};
