import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
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
      // ignore cache invalidation errors
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGalleryDto: CreateGalleryDto) {
    const result = await this.galleryService.create(createGalleryDto);
    await this.invalidateCache();
    return result;
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get('visible')
  findVisible() {
    return this.galleryService.findVisible();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    const result = await this.galleryService.update(id, updateGalleryDto);
    await this.invalidateCache();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('reorder')
  async reorder(@Body() body: { ids: string[] }) {
    const result = await this.galleryService.reorder(body.ids);
    await this.invalidateCache();
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.galleryService.remove(id);
    await this.invalidateCache();
    return result;
  }
}
