import { User } from "src/api/user/schemas/user.schema";

export type UserDTO = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "phone" | "flagged" | "activated"
>;

export type UserWithActivationPin = {
  user: UserDTO | Partial<User>;
  activationPin: number;
};

export type UserWithResetPin = {
  user: UserDTO;
  resetPin: number;
};

export type IScanner = {
  firstName: string;
  lastName: string;
  email: string;
  eventCode: string;
  scannerCode: string;
  eventId: string;

}

export interface IEventSchedule {
  name: string;
  date: string;
  start: string;
  end: string;
}

export type SendMailOptions = {
  sender?: string;
  subject: string;
  recipients: string[];
  message?: string;
  isHtml?: boolean;
  attachments?: any[];
  html?: string;
  body? : string;
  attachment?: {data: any, filename: string}
};

export interface PaystackTransactionConfig {
  amount: number;
  email: string;
  currency?: string;
  reference?: string | number;
  callback_url?: string;
  plan?: string;
  invoice_limit?: number;
  metadata?: any;
  channels?: string[]; // ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
  split_code?: string;
  subaccount?: string;
  bearer?: string;
  transaction_charge?: number;
}

export interface PaystackValidationResponse {
  status: boolean;
  message: string;
  data: Partial<{
    id: string;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    requested_amount: number;
    gateway_response: string;
    paidAt: string;
    createdAt: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    fees: number;
    customer: {
      id: string | number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
    };
  }>;
}
