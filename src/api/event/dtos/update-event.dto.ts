

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { IEventSchedule } from 'src/interfaces';
import { EventTicket } from '../schemas/event-ticket.schema';

export class UpdateEventDTO {

  id?: string;
  author?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'event description must be provided' })
  description: string;

  @ApiProperty()
  @IsString({ message: 'event category must be provided' })
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsIn(['single', 'multiple'])
  occurrence: "single" | "multiple" | ""

  @ApiProperty()
  @IsArray()
  @IsOptional()
  schedules: IEventSchedule[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tickets: EventTicket[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  venue: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'please enter a valid link' })
  image: string;

  @ApiProperty()
  @IsUrl({}, { message: 'please upload a valid landscape image' })
  @IsOptional()
  landscapeImage: string;

  @ApiProperty()
  @IsUrl({}, { message: 'please upload a valid landscape image' })
  @IsOptional()
  portraitImage: string;

}
