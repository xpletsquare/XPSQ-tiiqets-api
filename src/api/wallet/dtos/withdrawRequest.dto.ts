import {
  IsNumber,
  IsPositive,
  Min
} from "class-validator";

export class WithdrawRequestDTO {
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2, allowInfinity: false }, { message: 'value must be a valid number' })
  @IsPositive({ message: 'negative values not allowed' })
  @Min(10000, { message: 'amount must be equal or greater than NGN10,000' })
  amount: number
}
