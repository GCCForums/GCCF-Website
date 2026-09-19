import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface CreateAuditLogParams {
  actorId: string;
  actorUsername: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId?: string | null;
  changes?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class AuditService implements OnModuleInit {
  private readonly logger = new Logger(AuditService.name);
  private lastPruneTime = 0;

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async onModuleInit() {
    // Purge logs older than 1 month (30 days) on startup
    await this.pruneOldLogs();

    // Schedule daily purge (every 24 hours)
    setInterval(() => {
      this.pruneOldLogs().catch((err) =>
        this.logger.error(`Scheduled audit log prune failed: ${err.message}`),
      );
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Permanently delete audit logs older than 30 days (1 month) from database
   */
  async pruneOldLogs(): Promise<number> {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      const result = await this.auditRepository
        .createQueryBuilder()
        .delete()
        .from(AuditLog)
        .where('timestamp < :cutoff', { cutoff: oneMonthAgo })
        .execute();

      const deletedCount = result.affected || 0;
      if (deletedCount > 0) {
        this.logger.log(
          `Pruned ${deletedCount} audit log entries older than 30 days (${oneMonthAgo.toISOString()})`,
        );
      }
      return deletedCount;
    } catch (err) {
      this.logger.error(`Failed to prune old audit logs: ${err.message}`, err.stack);
      return 0;
    }
  }

  async record(params: CreateAuditLogParams): Promise<AuditLog> {
    // Throttled check: prune at most once every hour during active operations
    const now = Date.now();
    if (now - this.lastPruneTime > 60 * 60 * 1000) {
      this.lastPruneTime = now;
      this.pruneOldLogs().catch(() => {});
    }

    const entry = this.auditRepository.create({
      actorId: params.actorId,
      actorUsername: params.actorUsername,
      actorRole: params.actorRole,
      action: params.action,
      targetEntity: params.targetEntity,
      targetId: params.targetId || null,
      changes: params.changes || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    });
    return this.auditRepository.save(entry);
  }

  async findAll(
    page: number = 1,
    limit: number = 25,
    targetEntity?: string,
    actorUsername?: string,
  ) {
    // Enforce 1-month retention window: only show logs from the past 30 days
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const query = this.auditRepository
      .createQueryBuilder('log')
      .where('log.timestamp >= :cutoff', { cutoff: oneMonthAgo });

    if (targetEntity) {
      query.andWhere('log.targetEntity = :targetEntity', { targetEntity });
    }
    if (actorUsername) {
      query.andWhere('log.actorUsername = :actorUsername', { actorUsername });
    }

    query
      .orderBy('log.timestamp', 'DESC')
      .skip(skip)
      .take(safeLimit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }
}
