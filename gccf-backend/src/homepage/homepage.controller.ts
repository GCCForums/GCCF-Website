import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  async getHomepageContent() {
    return this.homepageService.getContent();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateHomepageContent(@Body() updateHomepageDto: UpdateHomepageDto) {
    return this.homepageService.updateContent(updateHomepageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetHomepageContent() {
    return this.homepageService.resetDefaults();
  }
}

