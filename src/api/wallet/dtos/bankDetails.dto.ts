import {
  IsOptional,
  IsString,
  Length
} from "class-validator";

export class BankDetailsDTO {
  @IsOptional()
  @IsString()
  user: string;

  @Length(11, 11, { message: "account number must be 11 digits" })
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsString()
  bankName: string;

  @IsString()
  bankCode: string;

  @IsString()
  @IsOptional()
  accountType: string;

  @IsString()
  @IsOptional()
  recipient: string;
}