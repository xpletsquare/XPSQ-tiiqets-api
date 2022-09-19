import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString } from "class-validator";

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
  phone: string;

  @ApiProperty()
  @IsString({ message: "invalid password entered" })
  password: string;
}
