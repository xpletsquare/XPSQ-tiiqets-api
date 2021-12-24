

import { IsNumber, IsString } from "class-validator";


export class ModifyCartItemDTO {
  @IsString()
  eventId: string;

  @IsString()
  ticketType: string;

  @IsNumber()
  quantity: number
}