import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateId } from 'src/utilities';
import { CreateEventTicketDTO } from './dtos/create-event-ticket.dto';
import { CreateEventDTO } from './dtos/create-event.dto';
import { UpdateEventTicketDTO } from './dtos/update-event-ticket.dto';
import { EventRepository } from './event.repository';
import { EventTicket } from './schemas/event-ticket.schema';

@Injectable()
export class EventService {
  constructor(
    private eventsRepository: EventRepository
  ) { }

  async createEvent(details: CreateEventDTO) {
    const event = await this.eventsRepository.createEvent(details);

    if (!event) {
      throw new BadRequestException('Sorry, we cannot create this event. Please try again later');
    }

    return event.toDto()
  }

  async updateEvent(id, updates) {
    const event = await this.eventsRepository.findOne(id);
    if (!event) throw new BadRequestException('Event not found');

    const isUpdated = await this.eventsRepository.updateEvent(id, updates);
    if (!isUpdated) throw new BadRequestException('Unable to update event');

    return isUpdated
  }

  async deleteEvent(id: string) {
    const event = await this.eventsRepository.findOne(id);
    if (!event) throw new BadRequestException('Event not found');

    const isDeleted = await this.eventsRepository.updateEvent(id);
    if (!isDeleted) throw new BadRequestException('Unable to delete event');
  }

  async addEventTicket(details: CreateEventTicketDTO) {
    const ticket: EventTicket = {
      ...details,
      id: generateId()
    };

    const event = await this.eventsRepository.findOne(ticket.eventId);

    if (!event) {
      throw new BadRequestException('Invalid event');
    }

    event.tickets = [...event.tickets, ticket];
    const updated = await this.eventsRepository.updateEvent(event.id, { tickets: event.tickets });

    if (!updated) {
      throw new InternalServerErrorException('Sorry, unable to add ticket at the moment.');
    }

    return true;
  }

  async updateEventTicket(details: UpdateEventTicketDTO) {

  }
}
