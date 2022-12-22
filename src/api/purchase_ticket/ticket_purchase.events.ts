import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { PaystackValidationResponse } from "src/interfaces";
import { CacheService } from "../common/providers/cache.service";
import { EmailService } from "../emails/email.service";
import { EventService } from "../event/event.service";
import { EventTicketPurchase } from "../event/schemas/event-ticket.schema";
import { TicketPurchaseHelper } from "./helper.service";
import { TicketPurchase } from "./schemas/ticket_purchase.schema";
import { TicketPurchaseRepository } from "./ticket_purchase.repository";
import { TicketPurchaseService } from "./ticket_purchase.service";

@Injectable()
export class TicketPurchaseEvents {
  constructor(
    private cacheService: CacheService,
    private ticketPurchaseRepo: TicketPurchaseRepository,
    private ticketPurchaseHelper: TicketPurchaseHelper,
    private eventEmitter: EventEmitter2,
    private ticketPurchaseService: TicketPurchaseService,
    private mailSevice: EmailService,
    private eventService: EventService
  ) {}

  private readonly logger = new Logger();

  @OnEvent("ticket.purchase.verified") // TODO: move to a constant or enum
  async handleTicketPurchaseVerified(payload: PaystackValidationResponse) {
    console.log("ticket purchase validation event handler called");

    const key = `PURCHASE-${payload.data.reference}`;
    const ticketPurchaseDetails = (await this.cacheService.get(
      key
    )) as Partial<TicketPurchase>;

    if (!ticketPurchaseDetails) {
      this.logger.log(
        `INVALID TICKET PURCHASE WITH REFERENCE - ${payload.data.reference}`
      );
      return;
    }

    const ticketPurchaseInDb = await this.ticketPurchaseRepo.findOne("", {
      paymentRef: payload.data.reference,
    });

    if (ticketPurchaseInDb) {
      return;
    }

    ticketPurchaseDetails.paid = true;
    const saved = await this.ticketPurchaseRepo.create(ticketPurchaseDetails);

    if (!saved) {
      this.logger.error("TICKET PURCHASE UPDATE FAILED");
    }

    this.eventEmitter.emit("ticket.purchase.saved", saved.toObject());
    // await this.cacheService.del(`PURCHASE-${payload.data.reference}`);
  }

  @OnEvent("ticket.purchase.saved")
  async handleTicketPurchaseSaved(payload: Partial<TicketPurchase>) {
    for (const summary of payload.ticketSummary) {
      const tickets = await this.ticketPurchaseHelper.generateTicketData(
        payload.eventId,
        summary as EventTicketPurchase,
        payload.paymentRef as string,
        payload.userEmail
      );

      payload.tickets = [...payload.tickets, ...tickets];
    }

    const event = await this.eventService.getEvent(payload.eventId);

    await this.ticketPurchaseService.updateTicketPurchase(payload.id, {
      tickets: payload.tickets,
    });

    await this.mailSevice.sendPurchaseConfirmation(event.title, payload);

    // payload.tickets.forEach(ticket => {
    //   this.mailSevice.sendTicketToUser(ticket);
    // })

    if (payload.promoterCode) {
      this.eventEmitter.emit("event.promotion.credit", {
        promoterCode: payload.promoterCode,
        amount: payload.cost * 0.02, // TODO: Move to Redis
      });
    }

    this.eventEmitter.emit("tickets.generated", payload.tickets);
  }

  @OnEvent("event.promotion.credit")
  async handleCreditUserRequest(payload) {
    this.logger.log(
      `CREDIT REQUEST RECEIVED - PROMOTERCODE - ${payload.promoterCode}`
    );
    console.log(payload);

    // find user having promoterCode
    // find user wallet
    // topUp with credit amount
  }
}
