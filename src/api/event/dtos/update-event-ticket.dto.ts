import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { EventStatus } from "../schemas/event.schema";

export class UpdateEventTicketDTO {
  @IsUUID()
  eventId: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus

  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  nLimit?: number;

  @IsOptional()
  @IsNumber()
  maxPurchases?: number;

  @IsOptional()
  @IsNumber()
  endSalesAt?: number;
}
