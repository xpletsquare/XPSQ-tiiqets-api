import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CacheService } from "./providers/cache.service";
import { PaystackService } from "./providers/paystack.service";



@Module({
  imports: [HttpModule],
  providers: [
    CacheService,
    PaystackService
  ],
  exports: [CacheService, PaystackService]
})
export class CommonModule { }