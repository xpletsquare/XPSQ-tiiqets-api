import { Module } from "@nestjs/common";
import { CacheService } from "./providers/cache.service";



@Module({
  providers: [
    CacheService
  ],
  exports: [CacheService]
})
export class CommonModule { }