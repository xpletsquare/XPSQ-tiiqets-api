import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class TicketPurchaseRequestDTO {
  @IsOptional()
  @IsString()
  eventId: string;

  @IsArray()
  @IsNotEmpty({ message: "purchases must be provided" })
  purchases: EventPurchaseItem[];

  @IsEmail({}, { message: "invalid user email" })
  userEmail: string;

  @IsString()
  @IsOptional()
  promoterCode: string;
}

export interface EventPurchaseItem {
  ticketId: string;
  count: number;
  labels: string[];
  userEmail: string;
}
