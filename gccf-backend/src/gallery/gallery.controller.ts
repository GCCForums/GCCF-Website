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
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('visible')
  findVisible() {
    return this.galleryService.findVisible();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.galleryService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Put('reorder')
  reorder(@Body() body: { ids: string[] }) {
    return this.galleryService.reorder(body.ids);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
