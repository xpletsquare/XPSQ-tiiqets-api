import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/utilities/successMessage';
import { CreateEventTicketDTO } from './dtos/create-event-ticket.dto';
import { CreateEventDTO } from './dtos/create-event.dto';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(
    private repository: EventRepository,
    private eventService: EventService
  ) { }

  @Post()
  async create(@Body() body: CreateEventDTO) {
    const event = await this.eventService.createEvent(body);
    return new SuccessResponse('Event created successfully', event);
  }

  @Post('tickets')
  async addTicket(@Body() body: CreateEventTicketDTO) {
    await this.eventService.addEventTicket(body);
    return new SuccessResponse('Event Ticket Created');
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const event = await this.repository.findOne(id);
    return new SuccessResponse('success', event.toDto());
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateEventDTO>) {
    await this.eventService.updateEvent(id, body);
    return new SuccessResponse('success', 'Event updated successfully');
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string) {
    await this.eventService.deleteEvent(id);
    return new SuccessResponse('Event updated successfully', id);
  }

  @Get()
  async getAll(@Query() query: any) {
    const events = await this.repository.findEvents({}, query.limit, query.skip);
    return new SuccessResponse('success', events.map(event => event.toDto()));
  }
}
