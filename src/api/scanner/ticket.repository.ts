import { Injectable, NotFoundException } from "@nestjs/common";
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
    private ticketPurchase: Model<TicketPurchaseDocument & {isUsed: boolean}>,
  ) {}

  // check mongo db for ticket
  async getTicket(identifier: string, filterQuery: FilterQuery<TicketPurchaseDocument> | null = null): Promise<TicketPurchaseDocument | any> {
    const ticket = await this.ticketPurchase
      .findOne(filterQuery || {id: identifier})
      .exec()      
      return ticket;
  }

  async validateTicket(identifier: string, filterQuery: FilterQuery<TicketPurchaseDocument> | null = null): Promise<TicketPurchaseDocument | any> {
    const ticket = await this.ticketPurchase
      .findOne(filterQuery || {id: identifier})
      .exec() 

      if(!ticket) return new NotFoundException("ticket not found");

      // if found, set the status to used : isUsed: true;
      const updatedTicket = await this.ticketPurchase
        .findOne(filterQuery || {id: identifier})
        .exec()
  
        const runUpdate = await this.ticketPurchase
        .updateOne(filterQuery || {id: identifier}, { isUsed: true }, { returnNewDocument: true, strict: false , new: true})
        .exec()

        console.log(runUpdate)
      
      return runUpdate?.modifiedCount >= 1;
  }

}