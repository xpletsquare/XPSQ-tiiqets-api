import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketPurchaseDocument } from './schemas/ticket_purchase.schema';
import { TicketPurchase } from './schemas/ticket_purchase.schema';
import { TicketPurchaseRequestDTO } from './dtos/ticket_purchase.dto';
import { generateId, generatePaymentRef } from 'src/utilities';
import { PaystackService } from '../common/providers/paystack.service';
import { CacheService } from '../common/providers/cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TicketPurchaseService {
  constructor(
    @InjectModel(TicketPurchase.name)
    private ticketPurchaseModel: Model<TicketPurchaseDocument>,
    private paystackService: PaystackService,
    private cacheService: CacheService,
    private eventEmitter: EventEmitter2
  ) {}

  async initiatePurchase(purchaseData: TicketPurchaseRequestDTO) {
    const ticketPurchase: Partial<TicketPurchase> = {
      id: generateId(),
      cost: 5000, // mock
      paymentRef: generatePaymentRef(),
      paymentDate: new Date().toISOString(),
      paid: false,
      purchases: purchaseData.purchases,
      eventId: purchaseData.eventId,
      userEmail: purchaseData.userEmail
    }

    const paystackResponse = await this.paystackService.initiateTransaction(ticketPurchase.userEmail, ticketPurchase.cost, ticketPurchase.paymentRef);

    if (!paystackResponse) {
      throw new BadRequestException('Unable to proceed. Please try again later');
    }

    // save ticket purchase to redis
    const key = `PURCHASE-${ticketPurchase.paymentRef}`;
    await this.cacheService.set(key, ticketPurchase);

    return paystackResponse;
  }

  async verifyTicketPayment(reference_id: string) {
    const response = await this.paystackService.verifyTransaction(reference_id);

    if (!response?.data?.paidAt) {
      throw new BadRequestException('Invalid purchase');
    }

    this.eventEmitter.emit('ticket.purchase.verified', response);
  }
}
