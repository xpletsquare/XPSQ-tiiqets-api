import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PaystackValidationResponse } from "src/interfaces";
import { CacheService } from "../common/providers/cache.service";
import { TicketPurchase } from "./schemas/ticket_purchase.schema";
import { TicketPurchaseRepository } from "./ticket_purchase.repository";



@Injectable()
export class TicketPurchaseEvents {
  constructor(
    private cacheService: CacheService,
    private ticketPurchaseRepo: TicketPurchaseRepository
  ) { }

  @OnEvent('ticket.purchase.verified') // TODO: move to a constant or enum
  async handleTicketPurchaseVerified(payload: PaystackValidationResponse) {

    console.log('ticket purchase validation event handler called');
    // Process valid ticketPurchase
    const key = `PURCHASE-${payload.data.reference}`;
    console.log(key);
    const ticketPurchaseDetails = await this.cacheService.get(key) as Partial<TicketPurchase>;

    if (!ticketPurchaseDetails) {
      console.log('ticket purchase details not found in cache');
      this.cacheService.logCacheKeys();
      return;
    }

    ticketPurchaseDetails.paid = true;
    const saved = await this.ticketPurchaseRepo.create(ticketPurchaseDetails);

    if (!saved) {
      return; // throw error
    }

    console.log(saved);
  }
}