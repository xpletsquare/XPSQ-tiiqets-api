import {
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
import { throwHttpError } from 'src/utilities/errorMessage';
import { SuccessResponse } from 'src/utilities/successMessage';
import { EventDTO } from './dtos/event.dto';
import { EventRepository } from './event.repository';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private repository: EventRepository) {}

  @Post()
  async create(@Body() body: EventDTO) {
    const event = await this.repository.createEvent(body);

    return new SuccessResponse('Event created successfully', event);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const event = await this.repository.findOne(id);

    return new SuccessResponse('success', event);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: Partial<EventDTO>) {
    const event = await this.repository.findOne(id);
    if (!event) throw throwHttpError(400, 'Event not found');

    const isUpdated = await this.repository.updateEvent(id, body);
    if (!isUpdated) throw throwHttpError(400, 'Unable to update event');

    return new SuccessResponse('success', 'Event updated successfully');
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string) {
    const event = await this.repository.findOne(id);
    if (!event) throw throwHttpError(400, 'Event not found');

    const isDeleted = await this.repository.updateEvent(id);
    if (!isDeleted) throw throwHttpError(400, 'Unable to delete event');

    return new SuccessResponse('success', 'Event updated successfully');
  }

  @Get()
  async getAll(@Query() query: any) {
    const { skip, limit } = query;
    const events = await this.repository.findEvents({}, limit, skip);
    return new SuccessResponse('success', events);
  }
}
