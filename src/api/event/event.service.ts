import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { generateId } from 'src/utilities';
import { CreateEventTicketDTO } from './dtos/create-event-ticket.dto';
import { CreateEventDTO } from './dtos/create-event.dto';
import { UpdateEventTicketDTO } from './dtos/update-event-ticket.dto';
import { EventRepository } from './event.repository';
import { EventTicket } from './schemas/event-ticket.schema';
import { Event } from './schemas/event.schema'

@Injectable()
export class EventService {
  constructor(
    private eventsRepository: EventRepository
  ) { }

  async getEvent(id: string) {
    const event = await this.eventsRepository.findOne(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async getTicketDetails(eventId: string, ticketId: string) {
    const event = await this.eventsRepository.findOne(eventId);

    if (!event) {
      return null;
    }

    const ticketDetails = event.findTicket(ticketId);

    if (!ticketDetails) {
      throw new BadRequestException('Invalid Ticket');
    }

    return ticketDetails;
  }

  async createEvent(details: CreateEventDTO) {
    const event = await this.eventsRepository.createEvent(details);

    if (!event) {
      throw new BadRequestException('Sorry, we cannot create this event. Please try again later');
    }

    return event.toDto()
  }

  async updateEvent(id: string, updates: Partial<UpdateEventTicketDTO & Event>) {
    const event = await this.eventsRepository.findOne(id);
    if (!event) throw new BadRequestException('Event not found');

    const isUpdated = await this.eventsRepository.updateEvent(id, updates as Partial<Event>);
    if (!isUpdated) throw new BadRequestException('Unable to update event');

    const updatedEvent = await this.eventsRepository.findOne(id);
    return updatedEvent.toDto();
  }

  async deleteEvent(id: string) {
    const event = await this.eventsRepository.findOne(id);
    if (!event) throw new BadRequestException('Event not found');

    const isDeleted = await this.eventsRepository.updateEvent(id);
    if (!isDeleted) throw new BadRequestException('Unable to delete event');
  }

  async addEventTicket(details: CreateEventTicketDTO) {
    const ticket: EventTicket = {
      id: generateId(),
      nLimit: details.nLimit,
      nSold: 0,
      name: details.name,
      price: details.price,
      eventId: details.eventId,
      endSalesAt: 0, // TODO: Calculate the time stamp of the associated schedule
      maxPurchases: details.maxPurchases,
      description: details.description
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
    const event = await this.eventsRepository.findOne(details.eventId);

    if (!event) {
      throw new BadRequestException('Invalid event');
    }

    const { tickets: eventTickets, status } = event;

    if (status !== 'DRAFT') {
      throw new BadRequestException('Cannot update tickets for a Published Event');
    }


    const ticketIndex = eventTickets.findIndex(ticket => ticket.id === details.id);

    if (ticketIndex === -1) {
      throw new BadRequestException('Invalid Ticket Details');
    }

    const ticketDetails = eventTickets.find(ticket => ticket.id === details.id);

    const { id, eventId, ...updateAbleFields } = ticketDetails;

    Object.keys(updateAbleFields).forEach(key => {
      ticketDetails[key] = details[key];
    })

    eventTickets[ticketIndex] = ticketDetails;
    const updated = await this.eventsRepository.updateEvent(event.id, { tickets: eventTickets })

    if (!updated) {
      throw new BadRequestException('Failed to update event. Please try again later');
    }

    return ticketDetails;
  }

}
