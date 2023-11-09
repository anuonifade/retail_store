import {
  IsDecimal,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class EditProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  upc?: number;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
