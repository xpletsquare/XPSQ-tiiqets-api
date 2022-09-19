import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketPurchaseController } from "./ticket_purchase.controller";
import { TicketPurchaseRepository } from "./ticket_purchase.repository";
import { TicketPurchaseService } from "./ticket_purchase.service";
import {
  TicketPurchase,
  TicketPurchaseSchema,
} from "./schemas/ticket_purchase.schema";
import { EventModule } from "../event/event.module";
import { CommonModule } from "../common/common.module";
import { TicketPurchaseHelper } from "./helper.service";
import { TicketPurchaseEvents } from "./ticket_purchase.events";
import { EmailModule } from "../emails/email.module";

@Module({
  imports: [
    CommonModule,
    EmailModule,
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
  providers: [
    TicketPurchaseRepository,
    TicketPurchaseService,
    TicketPurchaseHelper,
    TicketPurchaseEvents,
  ],
})
export class TicketPurchaseModule {}
