import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDTO } from './dtos/create-event.dto';
import { generateId } from 'src/utilities';


@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}


  async createEvent(dto: CreateEventDTO) {
    const eventData: CreateEventDTO & { id: string } = {
      id: generateId(),
      title: dto.title,
      venue: dto.venue,
      date: dto.date,
      description: dto.description,
      startsAt: dto.startsAt,
      endsAt: dto.endsAt,
      image: dto.image,
      category: dto.category,
      author: dto.author,
      // TODO: Implement Location Tracking
      // location: {
      //   longitude: dto.longitude,
      //   latitude: dto.latitude,
      // }
    };

    const event = await this.eventModel.create(eventData);

    return event || null;
  }

  async findOne(
    identifier: string,
    filterQuery: FilterQuery<EventDocument> | null = null,
  ): Promise<EventDocument> {
    const event = await this.eventModel
      .findOne(filterQuery || { id: identifier })
      .exec();

    return event || null;
  }

  async findEvents(
    filterQuery: FilterQuery<EventDocument> | null = null,
    limit = 100,
    skip = 0,
  ) {
    const events = await this.eventModel
      .find(filterQuery || {})
      .limit(+limit)
      .skip(+skip)
      .sort({ created_at: 'asc' })
      .exec();

    return events;
  }

  async updateEvent(eventId: string, updates: Partial<Event> = {}): Promise<boolean> {
    const { id, author, ...restOfUpdate } = updates;
    const data = await this.eventModel.updateMany({ id: eventId }, restOfUpdate);

    return data?.modifiedCount >= 1;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const data = await this.eventModel.deleteOne({ id });

    return data?.deletedCount >= 1;
  }
}