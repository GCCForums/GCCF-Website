import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async record(params: CreateAuditLogParams): Promise<AuditLog> {
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
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const where: FindOptionsWhere<AuditLog> = {};
    if (targetEntity) {
      where.targetEntity = targetEntity;
    }
    if (actorUsername) {
      where.actorUsername = actorUsername;
    }

    const [items, total] = await this.auditRepository.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      skip,
      take: safeLimit,
    });

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }
}
