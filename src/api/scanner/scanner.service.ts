import {
  Injectable,
} from "@nestjs/common";
import { TicketRepository } from "./ticket.repository";


@Injectable()
export class ScannerService {
  constructor(private ticketRepository: TicketRepository) {}

  async getTicketDetail(ticketId: string) {
    const ticket = this.ticketRepository.getTicket(ticketId);
    return ticket
  }

  async validateTicket(ticketId: string) {
    const ticket = this.ticketRepository.validateTicket(ticketId);
    return ticket;
  }
  // send reminder email
  async sendReminder() {
    // const reminderMail = s
    return 
  }
  
}