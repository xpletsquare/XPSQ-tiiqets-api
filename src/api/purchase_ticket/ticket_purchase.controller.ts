import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { throwHttpError } from "src/utilities/errorMessage";
import { SuccessResponse } from "src/utilities/successMessage";
import { TicketPurchaseRequestDTO } from "./dtos/ticket_purchase.dto";
import { ApiTags } from "@nestjs/swagger";
import { TicketPurchaseService } from "./ticket_purchase.service";
import { LoggedInGuard } from "../authentication/guards/loggedIn.guard";

@ApiTags("Purchases")
@Controller("purchase-tickets")
export class TicketPurchaseController {
  constructor(private ticketPurchaseService: TicketPurchaseService) {}

  @Post("initiate")
  async initiatePurchase(@Body() body: TicketPurchaseRequestDTO) {
    console.log({ body });
    const data = await this.ticketPurchaseService.initiatePurchase(body);
    return new SuccessResponse("success", data);
  }

  @UseGuards(LoggedInGuard)
  @Get("recents")
  async getRecentTicketPurchases() {
    const purchases = await this.ticketPurchaseService.getTicketPurchases();
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
    await this.ticketPurchaseService.verifyTicketPayment(txref);
    return new SuccessResponse();
  }
}
