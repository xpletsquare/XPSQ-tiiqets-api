import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Invalid email' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Invalid password' })
  @IsNotEmpty({ message: 'Invalid password' })
  password: string;
}
