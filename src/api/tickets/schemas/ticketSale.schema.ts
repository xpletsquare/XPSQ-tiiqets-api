import { Prop, Schema } from "@nestjs/mongoose";


@Schema({ timestamps: true })
export class TicketSale {

  @Prop()
  id: string;

  @Prop()
  buyerEmail: string;

  @Prop()
  buyerName: string;

  // @Prop()
  // cartItems: 

  @Prop()
  paymentConfirmed: boolean;

  @Prop()
  paymentRef: string;

}

interface TicketCartItem {
  name: string
  numberOfTickets: number
  pricePerUnit: number
}