import {
  IsOptional,
  IsString,
} from 'class-validator';

export class ProfileDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;
}
