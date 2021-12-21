import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  TicketPurchase,
  TicketPurchaseDocument,
} from './schemas/ticket_purchase.schema';
import { TicketPurchaseRequestDTO } from './dtos/ticket_purchase.dto';
import { generateId } from 'src/utilities';

@Injectable()
export class TicketPurchaseRepository {
  constructor(
    @InjectModel(TicketPurchase.name)
    private ticketPurchase: Model<TicketPurchaseDocument>,
  ) {}

  async create(dto: TicketPurchaseRequestDTO) {
    const purchaseData = {
      id: generateId(),
      purchases: dto.purchases,
    };

    const event = await this.ticketPurchase.create(purchaseData);

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
}
