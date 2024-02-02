import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { EventRepository } from '../event/event.repository';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';
import { EventService } from '../event/event.service';
import { TicketPurchaseModule } from '../purchase_ticket/ticket_purchase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketPurchase, TicketPurchaseSchema } from '../purchase_ticket/schemas/ticket_purchase.schema';
// import { TicketPurchaseRepository } from '../purchase_ticket/ticket_purchase.repository';

@Module({
  imports: [EventModule, UserModule,TicketPurchaseModule, MongooseModule.forFeature([
    {
      name: TicketPurchase.name,
      schema : TicketPurchaseSchema,
    }
  ])],
  controllers: [TicketController],
  providers: [TicketService, EventRepository, EventService]
})
export class TicketModule {}
