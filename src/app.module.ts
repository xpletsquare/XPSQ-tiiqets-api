import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApiModule } from './api/api.module';
import { ENV_KEYS } from './keys';

@Module({
  imports: [
    MongooseModule.forRoot(ENV_KEYS.MONGO_URL),
    EventEmitterModule.forRoot({
      maxListeners: 10
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
