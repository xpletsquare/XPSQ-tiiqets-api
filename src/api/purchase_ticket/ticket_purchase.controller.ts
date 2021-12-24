import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { throwHttpError } from 'src/utilities/errorMessage';
import { SuccessResponse } from 'src/utilities/successMessage';
import { TicketPurchaseRequestDTO } from './dtos/ticket_purchase.dto';
import { ApiTags } from '@nestjs/swagger';
import { TicketPurchaseService } from './ticket_purchase.service';

@ApiTags('Purchases')
@Controller('purchase-tickets')
export class TicketPurchaseController {
  constructor(
    private ticketPurchaseService: TicketPurchaseService
  ) {}

  @Post('initiate')
  async initiatePurchase(@Body() body: TicketPurchaseRequestDTO) {
    const data = await this.ticketPurchaseService.initiatePurchase(body);
    return new SuccessResponse('success', data);
  }

  @Get('recents')
  async getRecentTicketPurchases() {
    const purchases = await this.ticketPurchaseService.getTicketPurchases();
    return new SuccessResponse('success', purchases);
  }

  @Get('event/:eventId')
  async getEventTicketPurchases(@Param('eventId') eventId: string) {
    const purchases = await this.ticketPurchaseService.getTicketPurchases({ eventId });
    return new SuccessResponse('success', purchases);
  }

  @Get('single/:idOrReference')
  async getSinglePurchase(@Param('idOrReference') idOrReference: string) {
    const purchase = await this.ticketPurchaseService.getSingleTicket(idOrReference);
    return new SuccessResponse('success', purchase);
  }


  @Get('webhook')
  async paymentWebhook(@Query('txref') txref: string) {
    await this.ticketPurchaseService.verifyTicketPayment(txref);
    return new SuccessResponse();
  }
}
