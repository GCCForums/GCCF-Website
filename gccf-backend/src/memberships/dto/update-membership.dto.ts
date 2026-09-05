import { PartialType } from '@nestjs/mapped-types';
import { CreateMembershipDto } from './create-membership.dto';
import { IsEnum, IsOptional } from 'class-validator';

class PartialCreateMembershipDto extends PartialType(CreateMembershipDto) {}

export class UpdateMembershipDto extends PartialCreateMembershipDto {
  @IsOptional()
  @IsEnum(['pending', 'approved', 'declined'])
  status?: 'pending' | 'approved' | 'declined';
}