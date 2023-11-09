import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EditProductDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  upc?: number;

  @IsDecimal()
  @IsNotEmpty()
  price?: number;

  @IsNumber()
  quantity?: number;
}