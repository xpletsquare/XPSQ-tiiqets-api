import {
  // BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TicketRepository } from "./ticket.repository";


@Injectable()
export class ScannerService {
  constructor(private ticketRepository: TicketRepository) {}

  async getTicketDetail(ticketId: string) {
    console.log(ticketId)
    const ticket = this.ticketRepository.getTicket(ticketId);

    if (!ticket) {
      console.log('ticket not found');
      return new NotFoundException("Ticket not found")
    }
    return ticket
  }
  
}