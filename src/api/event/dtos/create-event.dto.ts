import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { IEventSchedule } from 'src/interfaces';
import { EventTicket } from '../schemas/event-ticket.schema';

export class CreateEventDTO {

  id?: string;

  @ApiProperty()
  @IsUUID()
  author?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString({ message: 'event description must be provided' })
  description: string;

  @ApiProperty()
  @IsString({ message: 'event category must be provided' })
  category: string;

  @ApiProperty()
  @IsString()
  venue: string;

  @IsIn(['single', 'multiple'])
  occurrence: "single" | "multiple" | ""

  @IsArray()
  schedules: IEventSchedule[]

  @IsArray()
  tickets: EventTicket[]

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNumber()
  startsAt: number;

  @ApiProperty()
  @IsNumber()
  endsAt: number;

  @ApiProperty()
  @IsUrl({}, { message: 'please upload a valid landscape image' })
  @IsOptional()
  landscapeImage: string;

  @ApiProperty()
  @IsUrl({}, { message: 'please upload a valid landscape image' })
  @IsOptional()
  portraitImage: string;

}
