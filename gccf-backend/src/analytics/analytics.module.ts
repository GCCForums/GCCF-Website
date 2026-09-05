import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Membership } from '../memberships/entities/membership.entity';
import { News } from '../news/entities/news.entity';
import { Event } from '../events/entities/event.entity';
import { Gallery } from '../gallery/entities/gallery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, News, Event, Gallery])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
