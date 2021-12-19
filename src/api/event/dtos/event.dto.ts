import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'event title must be provided' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'event title must be provided' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'event venue must be provided' })
  venue: string;

  @IsString()
  @IsNotEmpty({ message: 'event data must be provided' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'event description must be provided' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'event image should not be empty' })
  image: string;

  @IsArray()
  @IsNotEmpty({ message: 'event tickets type must be providedy' })
  tickets: { name: string; description: string; price: number };

  user_id?: string;
}
