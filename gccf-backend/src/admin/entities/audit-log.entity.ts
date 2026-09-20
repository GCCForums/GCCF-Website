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
  @Column()
  actorId: string;

  @Index()
  @Column()
  actorUsername: string;

  @Column()
  actorRole: string;

  @Index()
  @Column()
  action: string; // e.g. "POST /news", "PATCH /events/2"

  @Index()
  @Column()
  targetEntity: string; // e.g. "news", "events", "admin"

  @Column({ type: 'varchar', nullable: true })
  targetId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any> | null;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
