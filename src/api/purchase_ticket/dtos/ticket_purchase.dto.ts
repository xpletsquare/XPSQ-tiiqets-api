import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class TicketPurchaseRequestDTO {
  @IsOptional()
  @IsString()
  eventId: string;

  @IsArray()
  @IsNotEmpty({ message: 'purchases must be provided' })
  purchases: EventPurchaseItem[];

  @IsEmail({}, { message: 'invalid user email' })
  userEmail: string;
}

export interface EventPurchaseItem {
  ticketId: string
  count: number
}
