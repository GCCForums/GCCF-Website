import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeamMemberDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  affiliatedPart: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
