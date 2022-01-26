import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EventTicketPurchase } from "../event/schemas/event-ticket.schema";


export interface TicketRefundEventPayload {
  userEmail: string
  ticketSummary: EventTicketPurchase
  purchaseRef: string
}


@Injectable()
export class TicketRefundService {
  readonly logger = new Logger();

  @OnEvent('initiate.ticket.refund')
  handleTicketRefund(payload: TicketRefundEventPayload) {
    const { amountToPurchase, pricePerUnit } = payload.ticketSummary;
    const amountToRefund = amountToPurchase * pricePerUnit;
    this.logger.log(`INITIATING TICKET REFUND - ${payload.userEmail} - ${amountToPurchase}`);
    // TODO: Implement this in Wallet Service
  }
}