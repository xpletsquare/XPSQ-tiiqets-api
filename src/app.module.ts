import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ENV_KEYS } from './keys';

@Module({
  imports: [
    MongooseModule.forRoot(ENV_KEYS.MONGO_URL),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      global: true
    }),
    CacheModule.register({
      ttl: 30,
      max: ENV_KEYS.NODE_ENV === 'development' ? 1000 : 1_000_000,
      isGlobal: true
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
