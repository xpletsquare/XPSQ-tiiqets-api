import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Invalid password' })
  @IsNotEmpty({ message: 'Invalid password' })
  password: string;
}
