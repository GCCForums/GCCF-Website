import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Membership } from '../memberships/entities/membership.entity';
import { News } from '../news/entities/news.entity';
import { Event } from '../events/entities/event.entity';
import { Gallery } from '../gallery/entities/gallery.entity';

interface DateRange {
  start: Date;
  end: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalMembers,
      pendingMembers,
      activeEvents,
      totalNews,
      totalGallery,
      newMembersThisMonth,
      newMembersThisWeek,
      approvedMembers,
    ] = await Promise.all([
      this.membershipRepository.count(),
      this.membershipRepository.count({ where: { status: 'pending' } }),
      this.eventRepository.count({ where: { status: 'upcoming' } }),
      this.newsRepository.count(),
      this.galleryRepository.count(),
      this.membershipRepository.count({
        where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
      }),
      this.membershipRepository.count({
        where: { createdAt: MoreThanOrEqual(sevenDaysAgo) },
      }),
      this.membershipRepository.count({ where: { status: 'approved' } }),
    ]);

    const monthGrowth = totalMembers > 0 
      ? Math.round((newMembersThisMonth / totalMembers) * 100) 
      : 0;
    const weekGrowth = totalMembers > 0 
      ? Math.round((newMembersThisWeek / totalMembers) * 100) 
      : 0;

    return {
      totalMembers,
      pendingMembers,
      activeEvents,
      totalNews,
      totalGallery,
      approvedMembers,
      newMembersThisMonth,
      newMembersThisWeek,
      monthGrowth,
      weekGrowth,
    };
  }

  async getMemberGrowthData(days: number = 7) {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const members = await this.membershipRepository.find({
      where: {
        createdAt: MoreThanOrEqual(startDate),
      },
      order: { createdAt: 'ASC' },
    });

    const dailyData: { [key: string]: number } = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      dailyData[key] = 0;
    }

    members.forEach(member => {
      const key = member.createdAt.toISOString().split('T')[0];
      if (dailyData[key] !== undefined) {
        dailyData[key]++;
      }
    });

    const total = await this.membershipRepository.count();
    let cumulative = 0;

    return Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => {
        cumulative += count;
        return {
          date,
          members: cumulative,
          newMembers: count,
          total,
        };
      });
  }

  async getEventAttendanceData() {
    const events = await this.eventRepository.find({
      where: { status: 'completed' },
      order: { eventDate: 'DESC' },
      take: 10,
    });

    const byType = await this.eventRepository
      .createQueryBuilder('event')
      .select('event.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(event.attendees)', 'total')
      .where('event.status = :status', { status: 'completed' })
      .groupBy('event.category')
      .getRawMany();

    return {
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        date: e.eventDate,
        attendees: e.attendees || 0,
        location: e.location,
      })),
      byType: byType.map(t => ({
        category: t.category || 'Uncategorized',
        count: parseInt(t.count) || 0,
        total: parseInt(t.total) || 0,
      })),
    };
  }

  async getMembershipStats() {
    const byStatus = await this.membershipRepository
      .createQueryBuilder('membership')
      .select('membership.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('membership.status')
      .getRawMany();

    const byMonth = await this.membershipRepository
      .createQueryBuilder('membership')
      .select("TO_CHAR(membership.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(membership.createdAt, 'YYYY-MM')")
      .orderBy('month', 'DESC')
      .limit(6)
      .getRawMany();

    return {
      byStatus: byStatus.map(s => ({
        status: s.status,
        count: parseInt(s.count),
      })),
      byMonth: byMonth.reverse(),
    };
  }

  async getRecentActivity(limit: number = 10) {
    const [recentMembers, recentNews, recentEvents] = await Promise.all([
      this.membershipRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.newsRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.eventRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
    ]);

    const activities: Array<{
      type: 'member' | 'news' | 'event';
      action: string;
      title: string;
      timestamp: Date;
    }> = [];

    recentMembers.forEach(m => {
      activities.push({
        type: 'member',
        action: m.status === 'pending' ? 'applied for membership' : `membership ${m.status}`,
        title: `${m.firstName} ${m.lastName}`,
        timestamp: m.createdAt,
      });
    });

    recentNews.forEach(n => {
      activities.push({
        type: 'news',
        action: 'article published',
        title: n.title,
        timestamp: n.createdAt,
      });
    });

    recentEvents.forEach(e => {
      activities.push({
        type: 'event',
        action: e.status === 'upcoming' ? 'event created' : `event ${e.status}`,
        title: e.title,
        timestamp: e.createdAt,
      });
    });

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getEventStatsByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const upcoming = await this.eventRepository.count({
      where: {
        status: 'upcoming',
        eventDate: Between(start, end),
      },
    });

    const completed = await this.eventRepository.count({
      where: {
        status: 'completed',
        eventDate: Between(start, end),
      },
    });

    const eventsByMonth = await this.eventRepository
      .createQueryBuilder('event')
      .select("TO_CHAR(event.eventDate, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('event.eventDate BETWEEN :start AND :end', { start, end })
      .groupBy("TO_CHAR(event.eventDate, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      upcoming,
      completed,
      total: upcoming + completed,
      byMonth: eventsByMonth.reverse(),
    };
  }

  async getNewsActivityByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const total = await this.newsRepository.count({
      where: {
        publishedDate: Between(start, end),
      },
    });

    const byMonth = await this.newsRepository
      .createQueryBuilder('news')
      .select("TO_CHAR(news.publishedDate, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('news.publishedDate BETWEEN :start AND :end', { start, end })
      .groupBy("TO_CHAR(news.publishedDate, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    const byCategory = await this.newsRepository
      .createQueryBuilder('news')
      .select('news.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .where('news.publishedDate BETWEEN :start AND :end', { start, end })
      .groupBy('news.category')
      .getRawMany();

    return {
      total,
      byMonth: byMonth.reverse(),
      byCategory: byCategory.map(c => ({
        category: c.category || 'Uncategorized',
        count: parseInt(c.count),
      })),
    };
  }

  async getMembershipByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const byStatus = await this.membershipRepository
      .createQueryBuilder('membership')
      .select('membership.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('membership.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('membership.status')
      .getRawMany();

    const byMonth = await this.membershipRepository
      .createQueryBuilder('membership')
      .select("TO_CHAR(membership.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('membership.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy("TO_CHAR(membership.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return {
      byStatus: byStatus.map(s => ({
        status: s.status,
        count: parseInt(s.count),
      })),
      byMonth: byMonth.reverse(),
    };
  }

  async getComprehensiveAnalytics(startDate?: string, endDate?: string) {
    const now = new Date();
    let start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let end = endDate ? new Date(endDate) : now;

    const [
      dashboardStats,
      memberGrowth,
      eventStats,
      membershipStats,
      newsActivity,
      recentActivity,
    ] = await Promise.all([
      this.getDashboardStats(),
      this.getMemberGrowthData(30),
      this.getEventStatsByDateRange(start.toISOString(), end.toISOString()),
      this.getMembershipByDateRange(start.toISOString(), end.toISOString()),
      this.getNewsActivityByDateRange(start.toISOString(), end.toISOString()),
      this.getRecentActivity(20),
    ]);

    return {
      dateRange: { start: start.toISOString(), end: end.toISOString() },
      dashboardStats,
      memberGrowth,
      eventStats,
      membershipStats,
      newsActivity,
      recentActivity,
    };
  }

  async getExportData(type: 'members' | 'events' | 'news', startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    if (type === 'members') {
      const members = await this.membershipRepository.find({
        where: {
          createdAt: Between(start, end),
        },
        order: { createdAt: 'DESC' },
      });
      return members.map(m => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        phone: m.phone,
        organization: m.organization,
        occupation: m.occupation,
        status: m.status,
        createdAt: m.createdAt,
      }));
    }

    if (type === 'events') {
      const events = await this.eventRepository.find({
        where: {
          eventDate: Between(start, end),
        },
        order: { eventDate: 'DESC' },
      });
      return events.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        eventDate: e.eventDate,
        location: e.location,
        status: e.status,
        attendees: e.attendees,
        organizer: e.organizer,
      }));
    }

    if (type === 'news') {
      const news = await this.newsRepository.find({
        where: {
          publishedDate: Between(start, end),
        },
        order: { publishedDate: 'DESC' },
      });
      return news.map(n => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        author: n.author,
        category: n.category,
        publishedDate: n.publishedDate,
        source: n.source,
      }));
    }

    return [];
  }
}
