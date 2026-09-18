import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}
