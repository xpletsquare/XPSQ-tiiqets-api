import { IsEmail, IsNumber } from "class-validator";

export class ActivateUserDTO {
  @IsEmail({}, { message: "invalid email" })
  email: string;

  @IsNumber({}, { message: "invalid otp" })
  otp: number;
}
