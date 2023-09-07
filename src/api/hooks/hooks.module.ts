import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HooksService } from './hooks.service';
import { PaystackService } from '../common/providers/paystack.service';
import { HooksController } from './hooks.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    HttpModule,
    WalletModule
  ],
  controllers: [HooksController],
  providers: [HooksService, PaystackService]
})
export class HooksModule {}
