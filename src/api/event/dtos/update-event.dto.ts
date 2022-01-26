

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

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
  @IsOptional()
  @IsString()
  venue: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  date: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  startsAt: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  endsAt: number;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'please enter a valid link' })
  image: string;

}
