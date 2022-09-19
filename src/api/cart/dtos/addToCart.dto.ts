import { IsNumber, IsString } from "class-validator";

export class AddToCartDTO {
  @IsString()
  eventId: string;

  @IsString()
  ticketType: string;

  @IsNumber()
  quantity: number;
}
