

import { IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateEventTicketDTO {
  eventId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number

  @IsOptional()
  @IsNumber()
  availableTickets: number;

  @IsOptional()
  @IsNumber()
  maxPossiblePurchases: number

  @IsOptional()
  @IsNumber()
  endSalesAt: number;
}