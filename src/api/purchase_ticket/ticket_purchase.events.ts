import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
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

export enum TICKET_EVENTS {
  FREE_TICKET_PURCHASED = "free.ticket.purchase",
  TICKET_PURCHASE_VERIFIED = "ticket.purchase.verified",
  TICKET_PURCHASE_SAVED = "ticket.purchase.saved",
}

@Injectable()
export class TicketPurchaseEvents {
  constructor(
    private cacheService: CacheService,
    private ticketPurchaseRepo: TicketPurchaseRepository,
    private ticketPurchaseHelper: TicketPurchaseHelper,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => TicketPurchaseService ))
    private ticketPurchaseService: TicketPurchaseService,
    private mailSevice: EmailService,
    private eventService: EventService,
  ) {}

  private readonly logger = new Logger();

  @OnEvent(TICKET_EVENTS.FREE_TICKET_PURCHASED)
  async handleFreeTicketPurchase(ticketPaymentRef: string) {
    this.handleTicketPurchaseVerified({ data: { reference: ticketPaymentRef } });
  }

  @OnEvent(TICKET_EVENTS.TICKET_PURCHASE_VERIFIED)
  async handleTicketPurchaseVerified(payload: Partial<PaystackValidationResponse>) {
    const { reference } = payload.data;
    const key = `PURCHASE-${reference}`;
    const ticketPurchaseDetails = (await this.cacheService.get(
      key
    )) as Partial<TicketPurchase>;

    if (!ticketPurchaseDetails) {
      this.logger.log(
        `INVALID TICKET PURCHASE WITH REFERENCE - ${reference}`
      );
      return;
    }

    const ticketPurchaseInDb = await this.ticketPurchaseRepo.findOne("", {
      paymentRef: reference,
    });

    if (ticketPurchaseInDb) {
      return;
    }

    ticketPurchaseDetails.paid = true;
    const saved = await this.ticketPurchaseRepo.create(ticketPurchaseDetails);

    if (!saved) {
      this.logger.error("TICKET PURCHASE UPDATE FAILED");
    }

    this.eventEmitter.emit(TICKET_EVENTS.TICKET_PURCHASE_SAVED, saved.toObject());
    await this.cacheService.del(`PURCHASE-${payload.data.reference}`);
  }

  @OnEvent(TICKET_EVENTS.TICKET_PURCHASE_SAVED)
  async handleTicketPurchaseSaved(payload: Partial<TicketPurchase>) {

    for (const summary of payload.ticketSummary) {
      console.log({summary})
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

    

    const eventImage = event.image.landscape;
    await this.mailSevice.sendPurchaseConfirmation(event.title, payload, eventImage);

    // send tickets to each user
    payload.tickets.forEach(ticket => {
      console.log({myTicket: ticket})
      this.mailSevice.sendTicketToUser(ticket);
    })

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
