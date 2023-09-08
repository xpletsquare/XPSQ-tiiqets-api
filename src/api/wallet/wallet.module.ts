import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { EventModule } from "../event/event.module";
import { TicketPurchaseModule } from "../purchase_ticket/ticket_purchase.module";
import { BankDetails, BankDetailsSchema } from "./schemas/bankDetails.schema";
import { EventWallet, EventWalletSchema } from "./schemas/event-wallet.schema";
import { Wallet, WalletSchema } from "./schemas/wallet.schema";
import {
  WithdrawalRequest,
  WithdrawalRequestSchema,
} from "./schemas/withdrawal.schema";
import { WalletController } from "./wallet.controller";
import { WalletHelpers } from "./wallet.helper";
import { WalletService } from "./wallet.service";
import { PaystackService } from "../common/providers/paystack.service";

@Module({
  imports: [
    EventModule,
    TicketPurchaseModule,
    MongooseModule.forFeature([
      {
        name: WithdrawalRequest.name,
        schema: WithdrawalRequestSchema,
      },
      {
        name: Wallet.name,
        schema: WalletSchema,
      },
      {
        name: BankDetails.name,
        schema: BankDetailsSchema,
      },
      {
        name: EventWallet.name,
        schema: EventWalletSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletHelpers, PaystackService],
  exports: [WalletHelpers]
})
export class WalletModule {}
