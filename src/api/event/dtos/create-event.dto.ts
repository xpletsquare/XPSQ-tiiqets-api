import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateEventDTO {

  id?: string;
  user_id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event description must be provided' })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event description must be provided' })
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
