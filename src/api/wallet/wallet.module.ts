import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventModule } from "../event/event.module";
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

@Module({
  imports: [
    EventModule,
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
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletHelpers],
})
export class WalletModule {}
