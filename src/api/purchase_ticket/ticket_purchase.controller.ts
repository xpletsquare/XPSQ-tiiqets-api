import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get('webhook')
  async paymentWebhook(@Query('txref') txref: string) {
    await this.ticketPurchaseService.verifyTicketPayment(txref);
    return new SuccessResponse();
  }
}
