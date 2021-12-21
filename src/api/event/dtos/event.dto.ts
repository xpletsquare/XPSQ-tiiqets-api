import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class EventDTO {

  id?: string;
  user_id?: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event title must be provided' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event venue must be provided' })
  venue: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event data must be provided' })
  date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event description must be provided' })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'event image should not be empty' })
  image: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'event tickets type must be providedy' })
  tickets: {
    name: string;
    description: string;
    price: number;
  }[];
}
