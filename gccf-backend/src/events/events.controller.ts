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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('completed')
  findCompleted() {
    return this.eventsService.findCompleted();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
