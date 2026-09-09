import { IsOptional, IsObject } from 'class-validator';

export class UpdateHomepageDto {
  @IsOptional()
  @IsObject()
  hero?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metrics?: Record<string, any>;

  @IsOptional()
  @IsObject()
  about?: Record<string, any>;

  @IsOptional()
  @IsObject()
  faq?: Record<string, any>;

  @IsOptional()
  @IsObject()
  extraSections?: Record<string, any>;
}
