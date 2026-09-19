import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HomepageService } from './homepage.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('homepage')
export class HomepageController {
  constructor(
    private readonly homepageService: HomepageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateCache() {
    try {
      if (typeof this.cacheManager.clear === 'function') {
        await this.cacheManager.clear();
      } else if (typeof (this.cacheManager as any).reset === 'function') {
        await (this.cacheManager as any).reset();
      }
    } catch {
      // ignore
    }
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  async getHomepageContent() {
    return this.homepageService.getContent();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateHomepageContent(@Body() updateHomepageDto: UpdateHomepageDto) {
    const res = await this.homepageService.updateContent(updateHomepageDto);
    await this.invalidateCache();
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetHomepageContent() {
    const res = await this.homepageService.resetDefaults();
    await this.invalidateCache();
    return res;
  }
}
