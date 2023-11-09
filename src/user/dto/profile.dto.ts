import { IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  first_name?: string;

  @IsString()
  last_name?: string;
}
