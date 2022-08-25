import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
