import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// import { Event, EventSchema } from "./schemas/event.schema";
import { ScannerController } from "./scanner.controller";
import { ScannerService } from "./scanner.service";
import { TicketRepository } from "./ticket.repository";
import { EventTicket, TicketSchema } from "../event/schemas/event-ticket.schema";
import { TicketPurchase, TicketPurchaseSchema } from "../purchase_ticket/schemas/ticket_purchase.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EventTicket.name,
        schema: TicketPurchaseSchema,
      },
      {
        name: TicketPurchase.name,
        schema: TicketPurchaseSchema,
      },
    ]),
  ],
  controllers: [ScannerController],
  providers: [ScannerService, TicketRepository],
  exports: [ScannerService, TicketRepository, MongooseModule],
})
export class ScannerModule {}
