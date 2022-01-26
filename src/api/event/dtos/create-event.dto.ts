import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

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
  @IsUrl({}, { message: 'please enter a valid link' })
  image: string;

}
