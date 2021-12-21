import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketPurchaseController } from './ticket_purchase.controller';
import { TicketPurchaseRepository } from './ticket_purchase.repository';
import { TicketPurchaseService } from './ticket_purchase.service';
import {
  TicketPurchase,
  TicketPurchaseSchema,
} from './schemas/ticket_purchase.schema';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    HttpModule,
    EventModule,
    MongooseModule.forFeature([
      {
        name: TicketPurchase.name,
        schema: TicketPurchaseSchema,
      },
    ]),
  ],
  controllers: [TicketPurchaseController],
  providers: [TicketPurchaseRepository, TicketPurchaseService],
})
export class TicketPurchaseModule {}
