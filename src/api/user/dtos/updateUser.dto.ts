import { IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  hashedPassword?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
