import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  IsEmail,

} from "class-validator";
// import { IScanner } from "src/interfaces";

export class CreateScannerDTO {
  id?: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  eventCode: string;

  @ApiProperty()
  @IsString()
  scannerCode: string;

  @ApiProperty()
  @IsUUID()
  eventId: string;
}