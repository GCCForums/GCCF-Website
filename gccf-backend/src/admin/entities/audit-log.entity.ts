import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  actorId: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  actorUsername: string;

  @Column({ type: 'varchar', length: 50 })
  actorRole: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  action: string; // e.g. "POST /news", "PATCH /events/2"

  @Index()
  @Column({ type: 'varchar', length: 100 })
  targetEntity: string; // e.g. "news", "events", "admin"

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any> | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
