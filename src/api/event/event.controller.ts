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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "src/utilities/successMessage";
import { LoggedInGuard } from "../authentication/guards/loggedIn.guard";
import { CreateEventTicketDTO } from "./dtos/create-event-ticket.dto";
import { CreateEventDTO } from "./dtos/create-event.dto";
import { UpdateEventTicketDTO } from "./dtos/update-event-ticket.dto";
import { EventRepository } from "./event.repository";
import { EventService } from "./event.service";
import { Event } from "./schemas/event.schema";
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import { CloudinaryHelper } from "src/utilities/cloudinary.service";
import { createReadStream, createWriteStream } from "fs";

@ApiTags("Events")
@Controller("events")
export class EventController {
  constructor(
    private repository: EventRepository,
    private eventService: EventService,
    private cloudinaryService: CloudinaryHelper
  ) {}

  @UseGuards(LoggedInGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "landscape", maxCount: 1 },
      { name: "portrait", maxCount: 1 },
    ])
  )

  // async createEvent(@Body() body: CreateEventDTO | any ) {
  async createEvent(
    @UploadedFiles()
    files: {
      landscape?: Express.Multer.File[];
      portrait?: Express.Multer.File[];
    },
    @Body() body: any
  ) {
    const { landscape }: any = files; // Get uploaded images
    const rest = JSON.parse(body.rest);
    const BufferFile = landscape[0].buffer;

    const fileObj: any = await this.cloudinaryService.streamUpload(BufferFile);
    // console.log(BufferFile);
    const img = fileObj?.secure_url;
    rest.landscapeImage = img;
    rest.portraitImage = img;

    console.log(rest);

    // return "success";
    const event = await this.eventService.createEvent(rest);
    return new SuccessResponse("Event created successfully", event);
  }

  @UseGuards(LoggedInGuard)
  @Post("tickets")
  async createEventTicket(@Body() body: CreateEventTicketDTO) {
    await this.eventService.addEventTicket(body);
    return new SuccessResponse("Event Ticket Created");
  }

  @UseGuards(LoggedInGuard)
  @Put("tickets")
  async modifyEventTicket(@Body() body: UpdateEventTicketDTO) {
    const updatedTicket = await this.eventService.updateEventTicket(body);
    return new SuccessResponse("Event Ticket Updated", updatedTicket);
  }

  @UseGuards(LoggedInGuard)
  @ApiBody({
    description: "Allows users to see their events",
  })
  @Get("mine/:userId")
  async getMyEvents(@Param("userId") userId: string, @Query() query: any) {
    const events = await this.repository.findEvents(
      { author: userId },
      query.limit,
      query.skip
    );
    return new SuccessResponse(
      "success",
      events.map((event) => event.toDto())
    );
  }

  @Get(":id")
  async getSingleEvent(@Param("id") id: string) {
    const event = await this.eventService.getEvent(id);
    return new SuccessResponse("event retrieved", event);
  }

  @UseGuards(LoggedInGuard)
  @Put(":id")
  async updateEvent(
    @Param("id") id: string,
    @Body() body: Partial<UpdateEventTicketDTO & Event>
  ) {
    const updatedEvent = await this.eventService.updateEvent(id, body);
    return new SuccessResponse("event updated successfully", updatedEvent);
  }

  @UseGuards(LoggedInGuard)
  @Put(":id/status")
  async changeEventStatus(
    @Param("id") id: string,
    @Body() body: Pick<Event, "status">
  ) {
    const updatedEvent = await this.eventService.changeEventStatus(
      id,
      body.status
    );
    return new SuccessResponse("event updated successfully", updatedEvent);
  }

  @UseGuards(LoggedInGuard)
  @Delete(":id")
  async deleteEvent(@Param("id") id: string) {
    await this.eventService.deleteEvent(id);
    return new SuccessResponse("event updated successfully", id);
  }

  @Get()
  async getMultipleEvents(@Query() query: any) {
    const events = await this.repository.findEvents(
      { status: "ACTIVE" },
      query.limit,
      query.skip
    );
    return new SuccessResponse(
      "success",
      events.map((event) => event.toDto())
    );
  }
}
