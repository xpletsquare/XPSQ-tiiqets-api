import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  TicketPurchase,
  TicketPurchaseDocument,
} from './schemas/ticket_purchase.schema';
import { generateId } from 'src/utilities';
import { EventService } from '../event/event.service';

@Injectable()
export class TicketPurchaseRepository {
  constructor(
    @InjectModel(TicketPurchase.name)
    private ticketPurchase: Model<TicketPurchaseDocument>,
    private eventService: EventService,
  ) {}

  async create(data: Partial<TicketPurchase>) {
    const dataToSave = {
      ...data,
      id: generateId()
    };

    const event = await this.ticketPurchase.create(dataToSave);
    return event || null;
  }

  async findOne(
    identifier: string,
    filterQuery: FilterQuery<TicketPurchaseDocument> | null = null,
  ): Promise<TicketPurchaseDocument> {
    const event = await this.ticketPurchase
      .findOne(filterQuery || { id: identifier })
      .exec();

    return event || null;
  }

  async find(
    filterQuery: FilterQuery<TicketPurchaseDocument> | null = null,
    limit = 100,
    skip = 0,
  ) {
    const events = await this.ticketPurchase
      .find(filterQuery || {})
      .limit(+limit)
      .skip(+skip)
      .sort({ created_at: 'asc' })
      .exec();

    return events;
  }

  async update(id: string, updates: any = {}): Promise<boolean> {
    const data = await this.ticketPurchase.updateMany({ id }, updates);
    return data?.modifiedCount >= 1;
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.ticketPurchase.deleteOne({ id });

    return data?.deletedCount >= 1;
  }

  async getSummary(eventId: string) {
    const event = await this.eventService.getEvent(eventId);

    const summaryMatch = { eventId, paid: true };
    const numberOfPurchases = await this.ticketPurchase.countDocuments(summaryMatch);

    const data = await this.ticketPurchase.aggregate([
      { $match: summaryMatch },
      {
        $group: {
          _id: "$eventId",
          total: {
            $sum: "$cost"
          }
        },
      }
    ]);

    const ticketSummary = event.tickets.map((ticket) => {
      return {
        ...ticket,
        valueSold: ticket.nSold * ticket.price
      }
    })

    return {
      numberOfPurchases,
      total: data[0].total,
      ticketSummary
    }
  }
}
