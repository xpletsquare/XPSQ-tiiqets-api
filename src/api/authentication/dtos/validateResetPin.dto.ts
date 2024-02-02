import { IsEmail, IsNumberString } from "class-validator";

export class ValidatePasswordResetPin {
  @IsEmail(null, { message: "Please enter a valid email" })
  email: string;

  @IsNumberString(null, { message: "invalid otp entered" })
  otp: string;
}
