import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BankDetails, BankDetailsSchema } from "./schemas/bankDetails.schema";
import { Wallet, WalletSchema } from "./schemas/wallet.schema";
import { WithdrawalRequest, WithdrawalRequestSchema } from "./schemas/withdrawal.schema";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WithdrawalRequest.name,
        schema: WithdrawalRequestSchema
      },
      {
        name: Wallet.name,
        schema: WalletSchema
      },
      {
        name: BankDetails.name,
        schema: BankDetailsSchema
      },

    ])
  ],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule { }