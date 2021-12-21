import { IsEmail, IsNumberString, IsString } from "class-validator";



export class CompletePasswordReset {


  @IsString({ message: 'please enter a password' })
  password: string

  @IsString({ message: 'please enter a valid token' })
  token: string

}