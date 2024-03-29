import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CONFIG } from "src/config";
import {
  PaystackTransactionConfig,
  PaystackValidationResponse,
  PaystackTransferRecipientConfig,
  PaystackInitiateTransferConfig
} from "src/interfaces";

@Injectable()
export class PaystackService {
  constructor(private httpClient: HttpService) {}

  private get headers() {
    return {
      headers: {
        Authorization: `Bearer ${CONFIG.paystackSecret}`,
      },
    };
  }



  async initiateTransaction(
    email: string,
    amount: number,
    reference: string | number,
    currency = "NGN"
  ) {
    console.log({seckey: CONFIG.paystackSecret })

    try {
      const payload: PaystackTransactionConfig = {
        amount: amount * 100, // paystack values are in kobo
        email,
        reference,
        currency,
        callback_url: CONFIG.paystackCallBackUrl,
      };

      
      const response = await this.httpClient
        .post(
          `${CONFIG.paystackURL}/transaction/initialize`,
          payload,
          this.headers
        )
        .toPromise();
      return response?.data;
    } catch (err) {
      console.log("paystackError: ", err);
      return null;
    }
  }

  async verifyTransaction(
    referenceId: string
  ): Promise<PaystackValidationResponse> {
    try {
      const response = await this.httpClient
        .get(
          `${CONFIG.paystackURL}/transaction/verify/${referenceId}`,
          this.headers
        )
        .toPromise();

      return response?.data;
    } catch (err) {
      console.log("error: ", err);
      return null;
    }
  }

  async listBanks() {
    const response = await this.httpClient
    .get(
      `${CONFIG.paystackURL}/bank?currency=NGN`,
      this.headers
    )
    .toPromise();
    return response.data;
  }

  async verifyBank(accountNumber: string, bankCode: string) {
    const response = await this.httpClient
    .get(
      `${CONFIG.paystackURL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      this.headers
    )
    .toPromise();
    return response.data?.data;
  }

  async createTransferRecipient(
    accountNumber: string,
    bankCode: string,
    accountName: string
  ) {
    const recipientConfig: PaystackTransferRecipientConfig = {
      account_number: accountNumber,
      bank_code: bankCode,
      type: 'nuban',
      name: accountName,
      currency: 'NGN'
    }
    const response = await this.httpClient
    .post(
      `${CONFIG.paystackURL}/transferrecipient`,
      recipientConfig,
      this.headers
    )
    .toPromise();
    return response?.data?.data;
  }

  async initiateTransfer(
    recipient: string,
    reason: string,
    reference: string,
    amount: number
  ) {
    const transactionConfig: PaystackInitiateTransferConfig = {
      reason,
      recipient,
      reference,
      amount: amount * 100,
      source: 'balance'
    }
    const response = await this.httpClient
    .post(
      `${CONFIG.paystackURL}/transfer`,
      transactionConfig,
      this.headers
    )
    .toPromise();
    return response?.data?.data;
  }
}
