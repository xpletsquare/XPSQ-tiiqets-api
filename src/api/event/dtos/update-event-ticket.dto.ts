

import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";


export class UpdateEventTicketDTO {
  @IsUUID()
  eventId: string;

  @IsUUID()
  id: string

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number

  @IsOptional()
  @IsNumber()
  availableTickets?: number;

  @IsOptional()
  @IsNumber()
  maxPossiblePurchases?: number

  @IsOptional()
  @IsNumber()
  endSalesAt?: number;
}