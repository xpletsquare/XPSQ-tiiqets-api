import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketPurchaseDocument } from './schemas/ticket_purchase.schema';
import { TicketPurchase } from './schemas/ticket_purchase.schema';
import { TicketPurchaseRequestDTO } from './dtos/ticket_purchase.dto';
import { generateId, generatePaymentRef } from 'src/utilities';
import { PaystackService } from '../common/providers/paystack.service';
import { CacheService } from '../common/providers/cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TicketPurchaseHelper } from './helper.service';
import { TicketPurchaseRepository } from './ticket_purchase.repository';

@Injectable()
export class TicketPurchaseService {
  constructor(
    @InjectModel(TicketPurchase.name)
    private paystackService: PaystackService,
    private cacheService: CacheService,
    private eventEmitter: EventEmitter2,
    private ticketPurchaseHelper: TicketPurchaseHelper,
    private ticketPurchaseRepo: TicketPurchaseRepository
  ) {}

  async initiatePurchase(dto: TicketPurchaseRequestDTO) {
    await this.ticketPurchaseHelper.validateTicketPurchases(dto);

    const ticketPurchase = await this.ticketPurchaseHelper.createTempTicketPurchase(dto)

    const paystackResponse = await this.paystackService.initiateTransaction(ticketPurchase.userEmail, ticketPurchase.cost, ticketPurchase.paymentRef);

    if (!paystackResponse) {
      throw new BadRequestException('Unable to proceed. Please try again later');
    }

    // save ticket purchase to redis
    const key = `PURCHASE-${ticketPurchase.paymentRef}`;
    await this.cacheService.set(key, ticketPurchase);

    return {
      purchase: ticketPurchase,
      payment: paystackResponse
    };
  }

  async verifyTicketPayment(reference_id: string) {
    const response = await this.paystackService.verifyTransaction(reference_id);

    if (!response?.data?.paidAt) {
      throw new BadRequestException('Invalid purchase');
    }

    this.eventEmitter.emit('ticket.purchase.verified', response);
  }

  async updateTicketPurchase(id: string, updates) {
    const updated = await this.ticketPurchaseRepo.update(id, { ...updates });

    if (!updated) {
      throw new Error('Ticket purchase update failed');
    }

    const ticketPurchaseDetails = await this.ticketPurchaseRepo.findOne(id);
    return ticketPurchaseDetails || null;
  }

  async getTicketPurchases(query = {}) {
    const purchases = await this.ticketPurchaseRepo.find(query);
    return purchases.map(purchase => {
      const { tickets, _id, __v, ...rest } = purchase.toObject()
      return rest;
    })
  }

  async getSingleTicket(idOrReference) {
    const purchase = await this.ticketPurchaseRepo.findOne('', {
      $or: [
        { id: idOrReference },
        { paymentRef: idOrReference }
      ]
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase.toObject();
  }
}
