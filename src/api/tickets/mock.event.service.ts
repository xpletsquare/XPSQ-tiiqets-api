import { Injectable } from "@nestjs/common";

@Injectable()
export class MockEventService {
  async verifyTicket(ticketId: string, eventId: string) {
    return Promise.resolve(true);
  }

  async getEventTicketDetails(ticketId: string, eventId: string) {
    if (eventId !== "test") {
      return null;
    }

    return {
      id: ticketId,
      name: "regular",
      price: 3000,
      availableTickets: 1000,
    };
  }
}
