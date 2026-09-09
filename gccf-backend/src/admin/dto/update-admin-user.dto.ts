import {
  IsString,
  IsOptional,
  IsIn,
  IsArray,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn(['super_admin', 'admin'])
  role?: 'super_admin' | 'admin';

  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
