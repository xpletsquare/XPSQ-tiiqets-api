import { IsArray, IsEnum, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { IEventSchedule } from "src/interfaces";
import { EventTicket } from "../schemas/event-ticket.schema";


export class CreateEventTicketDTO {
  @IsString()
  eventId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number

  @IsNumber()
  nLimit: number;

  @IsOptional()
  @IsNumber()
  maxPurchases: number

  @IsOptional()
  @IsNumber()
  endSalesAt: number;

  @IsString()
  schedule: string;
}