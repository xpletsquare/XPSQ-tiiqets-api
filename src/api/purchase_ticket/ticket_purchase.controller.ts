import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SuccessResponse } from "src/utilities/successMessage";
import { TicketPurchaseRequestDTO } from "./dtos/ticket_purchase.dto";
import { ApiTags } from "@nestjs/swagger";
import { TicketPurchaseService } from "./ticket_purchase.service";
import { LoggedInGuard } from "../authentication/guards/loggedIn.guard";
import { AdminGuard } from "../authentication/guards/admin.guard";

@ApiTags("Purchases")
@Controller("purchase-tickets")
export class TicketPurchaseController {
  constructor(private ticketPurchaseService: TicketPurchaseService) {}

  @Post("initiate")
  async initiatePurchase(@Body() body: TicketPurchaseRequestDTO) {
    const data = await this.ticketPurchaseService.initiatePurchase(body);
    return new SuccessResponse("success", data);
  }

  @UseGuards(AdminGuard)
  @Get("recents")
  async getRecentTicketPurchases() {
    const purchases = await this.ticketPurchaseService.getTicketPurchases();

    console.log(purchases.length)
    return new SuccessResponse("success", purchases);
  }

  

  @UseGuards(LoggedInGuard)
  @Get("event/:eventId")
  async getEventTicketPurchases(@Param("eventId") eventId: string) {
    const purchases = await this.ticketPurchaseService.getTicketPurchases({
      eventId,
    });
    return new SuccessResponse("success", purchases);
  }

  @Get("single/:idOrReference")
  async getSinglePurchase(@Param("idOrReference") idOrReference: string) {
    const purchase = await this.ticketPurchaseService.getSingleTicket(
      idOrReference
    );
    return new SuccessResponse("success", purchase);
  }

  @Get("summary/:eventId")
  async getPurchaseSummary(@Param("eventId") eventId: string) {
    const summary = await this.ticketPurchaseService.getPurchaseSummaryForEvent(
      eventId
    );
    return new SuccessResponse("success", summary);
  }

  @Get("webhook")
  async paymentWebhook(@Query("txref") txref: string) {
    console.log({ticketRef: txref })
    await this.ticketPurchaseService.verifyTicketPayment(txref);
    return new SuccessResponse();
  }
}
