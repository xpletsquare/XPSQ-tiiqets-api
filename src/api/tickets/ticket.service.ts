import { Injectable } from '@nestjs/common';
import { EventRepository } from '../event/event.repository';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketPurchase, TicketPurchaseDocument } from '../purchase_ticket/schemas/ticket_purchase.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketPurchase.name)
    private ticketPurchase: Model<TicketPurchaseDocument>,
    private eventRepository: EventRepository, 
    private userService: UserService) {}

  async getHostTicketSale(query = {}) {
    // get the user
    const purchases = await this.ticketPurchase
    .find(query)
    .sort({ createdAt: "desc"})
    .exec();
    return purchases
  }

  async getTickets(userId:string) : Promise<any>{

    // get the current user
    const { id }:any = userId
    const user = await this.userService.getSingleUser(id);

    const events = (await this.eventRepository.findEvents({ author: user.id })).reverse()
    const t = Promise.all(events.map( async event => await this.getHostTicketSale({eventId : event.id})))
    const tickets_sold = (await t).flat(2)
    
    
    return tickets_sold
    // const tickets = await this.eventRepository.findOne(userId)
    
  }

 
}
