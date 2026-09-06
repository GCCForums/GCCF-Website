import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('latest')
  findLatest(@Query('limit') limit?: number) {
    return this.newsService.findLatest(limit ? Number(limit) : 5);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.newsService.findByCategory(category);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
