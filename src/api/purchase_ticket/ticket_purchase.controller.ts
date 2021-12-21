import { Body, Controller, Post } from '@nestjs/common';
import { throwHttpError } from 'src/utilities/errorMessage';
import { SuccessResponse } from 'src/utilities/successMessage';
import { EventDocument } from '../event/schemas/event.schema';
import { EventRepository } from '../event/event.repository';
import { TicketPurchaseRequestDTO } from './dtos/ticket_purchase.dto';
import { TicketPurchaseRepository } from './ticket_purchase.repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Purchases')
@Controller('purchase-tickets')
export class TicketPurchaseController {
  constructor(
    private repository: TicketPurchaseRepository,
    private eventRepo: EventRepository,
  ) {}

  @Post()
  async create(@Body() body: TicketPurchaseRequestDTO) {
    const { purchases } = body;
    let totalPayment = 0;

    for (let i = 0; i < purchases.length; i++) {
      const { event_id = 'null', tickets } = purchases[i];

      const _event: EventDocument = await this.eventRepo.findOne(event_id);
      if (!_event) throw throwHttpError(404, 'Event does not exist');

      tickets.map(({ id, count }) => {
        const selectedTicket = _event.tickets.find(
          (ticket) => ticket.id === id,
        );

        if (selectedTicket) totalPayment += +selectedTicket.price * +count;
      });

      return new SuccessResponse('Event created successfully', totalPayment);
    }
  }
}
