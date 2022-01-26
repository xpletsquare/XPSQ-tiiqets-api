import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CONFIG } from "src/config";
import { PaystackTransactionConfig, PaystackValidationResponse } from "src/interfaces";


@Injectable()
export class PaystackService {
  constructor(
    private httpClient: HttpService,
  ) { }

  private get headers() {
    return {
      headers: {
        Authorization: `Bearer ${CONFIG.paystackSecret}`,
      },
    }
  }

  async initiateTransaction(email: string, amount: number, reference: string | number, currency = 'NGN') {
    try {

      const payload: PaystackTransactionConfig = {
        amount: amount * 100, // paystack values are in kobo
        email,
        reference,
        currency,
        callback_url: CONFIG.paystackCallBackUrl
      }

      const response = await this.httpClient.post(`${CONFIG.paystackURL}/transaction/initialize`, payload, this.headers).toPromise();
      return response?.data;

    } catch (err) {
      console.log('error: ', err);
      return null;
    }
  }

  async verifyTransaction(referenceId: string): Promise<PaystackValidationResponse> {
    try {
      const response = await this.httpClient
        .get(`${CONFIG.paystackURL}/transaction/verify/${referenceId}`, this.headers)
        .toPromise()

      return response?.data;
    } catch (err) {
      console.log('error: ', err);
      return null;
    }
  }



}