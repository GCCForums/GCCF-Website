import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  // Public: anyone can apply for membership (throttled)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.create(createMembershipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  findPending() {
    return this.membershipsService.findPending();
  }

  @UseGuards(JwtAuthGuard)
  @Get('approved')
  findApproved() {
    return this.membershipsService.findApproved();
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-smtp/verify')
  testSmtp() {
    return this.membershipsService.testSmtp();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(id, updateMembershipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resend-approval')
  resendApproval(@Param('id') id: string) {
    return this.membershipsService.resendApprovalEmail(id);
  }
}
