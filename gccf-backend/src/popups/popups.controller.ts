import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PopupsService } from './popups.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';

@Controller('popups')
export class PopupsController {
  constructor(private readonly popupsService: PopupsService) {}

  @Post()
  create(@Body() createPopupDto: CreatePopupDto) {
    return this.popupsService.create(createPopupDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  findAll() {
    return this.popupsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get('active')
  findActive() {
    return this.popupsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.popupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePopupDto: UpdatePopupDto) {
    return this.popupsService.update(id, updatePopupDto);
  }

  @Patch(':id/toggle')
  toggleEnabled(
    @Param('id') id: string,
    @Body('enabled') enabled: boolean,
  ) {
    return this.popupsService.toggleEnabled(id, enabled);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.popupsService.remove(id);
  }
}
