import { IsEmail, IsNumberString, IsString } from "class-validator";


export class CreateTempUserDTO {

  @IsString({ message: 'invalid first name' })
  firstName: string;

  @IsString({ message: 'invalid last name' })
  lastName: string;

  @IsEmail({ message: 'invalid email' })
  email: string;

  @IsNumberString({ message: 'invalid phone number' })
  phone: string;

  @IsString({ message: 'invalid password entered' })
  password: string;
}