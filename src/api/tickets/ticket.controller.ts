import { Controller, Get, Param, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {

  constructor(
    private ticketService: TicketService
  ){}

  @Get()
  async getAllTickets(@Query() id:string){
    const res = await this.ticketService.getTickets(id)
    return res
  }
}
