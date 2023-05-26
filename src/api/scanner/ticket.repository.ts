import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { EventTicket } from "../event/schemas/event-ticket.schema";

import { generateSixDigitCode } from "src/utilities";
import { TicketPurchase, TicketPurchaseDocument } from "../purchase_ticket/schemas/ticket_purchase.schema";

@Injectable()
export class TicketRepository {
  constructor(
    @InjectModel(EventTicket.name) private ticketModel: Model<EventTicket>,
    @InjectModel(TicketPurchase.name)
    private ticketPurchase: Model<TicketPurchaseDocument>,
  ) {}

  // check mongo db for ticket
  async getTicket(identifier: string, filterQuery: FilterQuery<TicketPurchaseDocument> | null = null): Promise<TicketPurchaseDocument> {
    const ticket = await this.ticketPurchase
      .findOne(filterQuery || {id: identifier})
      .exec()

      console.log({ticket, identifier, filterQuery})
    return ticket;
  }


}