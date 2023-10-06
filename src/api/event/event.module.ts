import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventCategoryController } from "./event-category.controller";
import { EventCategoryService } from "./event-category.service";
import { EventController } from "./event.controller";
import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";
import {
  EventCategory,
  EventCategorySchema,
} from "./schemas/event-category.schema";
import { Event, EventSchema } from "./schemas/event.schema";
import { CloudinaryHelper } from "src/utilities/cloudinary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: EventCategory.name,
        schema: EventCategorySchema,
      },
    ]),
  ],
  controllers: [EventController, EventCategoryController],
  providers: [EventService, EventRepository, EventCategoryService, CloudinaryHelper],
  exports: [EventRepository, EventService, MongooseModule],
})
export class EventModule {}
