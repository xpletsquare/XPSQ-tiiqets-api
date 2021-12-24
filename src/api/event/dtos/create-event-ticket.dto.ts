import { IsNumber, IsOptional, IsString } from "class-validator";


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
  availableTickets: number;

  @IsOptional()
  @IsNumber()
  maxPossiblePurchases: number

  @IsOptional()
  @IsNumber()
  endSalesAt: number;
}