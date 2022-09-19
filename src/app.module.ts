import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CacheModule, Module } from "@nestjs/common";
import { ApiModule } from "./api/api.module";
import { CONFIG } from "./config";

@Module({
  imports: [
    MongooseModule.forRoot(CONFIG.MONGO_URL),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      global: true,
    }),
    CacheModule.register({
      ttl: 30,
      max: CONFIG.NODE_ENV === "development" ? 1000 : 1_000_000,
      isGlobal: true,
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
