import { IsString, IsDate, IsEnum, IsOptional, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  shortDescription: string;

  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @IsString()
  location: string;

  @IsString()
  slug: string;

  @IsEnum(['completed', 'upcoming'])
  status: 'completed' | 'upcoming';

  @IsString()
  mainImage: string;

  @IsOptional()
  @IsArray()
  galleryImages?: string[];

  @IsOptional()
  @IsString()
  organizer?: string;

  @IsOptional()
  @IsNumber()
  attendees?: number;
}