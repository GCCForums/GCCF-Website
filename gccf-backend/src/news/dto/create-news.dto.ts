import { IsString, IsDate, IsOptional, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  excerpt: string;

  @Type(() => Date)
  @IsDate()
  publishedDate: Date;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  slug: string;

  @IsString()
  featuredImage: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;
}