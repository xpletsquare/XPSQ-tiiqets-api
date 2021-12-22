import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { Model } from 'mongoose';
import { AxiosResponse } from 'axios';

import { TicketPurchaseDocument } from './schemas/ticket_purchase.schema';
import { TicketPurchase } from './schemas/ticket_purchase.schema';
import { CONFIG as CONFIG } from 'src/config';

@Injectable()
export class TicketPurchaseService {
  constructor(
    @InjectModel(TicketPurchase.name)
    private ticketPurchaseModel: Model<TicketPurchaseDocument>,
    private httpClient: HttpService,
  ) {}

  async subscribe(payload: any): Promise<AxiosResponse> {
    try {
      const response = await this.httpClient
        .post(`${CONFIG.paystackURL}/transaction/initialize`, payload, {
          headers: {
            Authorization: `Bearer ${CONFIG.paystackSecret}`,
          },
        })
        .toPromise();

      return response?.data;
    } catch (err) {
      console.log('error: ', err);
      return null;
    }
  }

  async verifyPayment(reference_id: string): Promise<AxiosResponse> {
    try {
      const response = await this.httpClient
        .get(`${CONFIG.paystackURL}/transaction/verify/${reference_id}`, {
          headers: {
            Authorization: `Bearer ${CONFIG.paystackSecret}`,
          },
        })
        .toPromise()

      return response?.data;
    } catch (err) {
      console.log('error: ', err);
      return null;
    }
  }
}
