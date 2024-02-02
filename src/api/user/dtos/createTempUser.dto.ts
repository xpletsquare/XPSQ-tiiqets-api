import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString, Length } from "class-validator";

export class CreateTempUserDTO {
  @ApiProperty()
  @IsString({ message: "invalid first name" })
  firstName: string;

  @ApiProperty()
  @IsString({ message: "invalid last name" })
  lastName: string;

  @ApiProperty()
  @IsEmail({ message: "invalid email" })
  email: string;

  @ApiProperty()
  @IsNumberString({ message: "invalid phone number" })
  @Length(11, 13, { message: "phone must not exceed 13 digit or be less than 11 digits"})
  phone: string;

  @ApiProperty()
  @IsString({ message: "invalid password entered" })
  password: string;
}
