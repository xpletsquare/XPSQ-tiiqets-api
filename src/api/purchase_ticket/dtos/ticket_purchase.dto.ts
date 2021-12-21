import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TicketPurchaseRequestDTO {
  @IsOptional()
  @IsString()
  id: string;

  @IsArray()
  @IsNotEmpty({ message: 'purchases must be provided' })
  purchases: {
    event_id: string;
    tickets: { id: string; name: string; count: number }[];
  }[];
}
