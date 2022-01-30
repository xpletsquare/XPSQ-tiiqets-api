

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
  nLimit?: number;

  @IsOptional()
  @IsNumber()
  maxPurchases?: number

  @IsOptional()
  @IsNumber()
  endSalesAt?: number;
}