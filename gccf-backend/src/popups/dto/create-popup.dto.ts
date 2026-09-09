import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePopupDto {
  @IsString()
  name: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  delaySeconds?: number;

  @IsOptional()
  @IsString()
  linkUrl?: string;
}
