import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CacheService } from "./providers/cache.service";
import { MailgunService } from "./providers/mailgun.service";
import { PaystackService } from "./providers/paystack.service";



@Module({
  imports: [HttpModule],
  providers: [
    CacheService,
    PaystackService,
    MailgunService
  ],
  exports: [CacheService, PaystackService, MailgunService]
})
export class CommonModule { }