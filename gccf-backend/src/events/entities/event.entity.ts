import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  shortDescription: string;

  @Index()
  @Column({ type: 'date' })
  eventDate: Date;

  @Column()
  location: string;

  @Column({ unique: true })
  slug: string;

  @Index()
  @Column({ default: 'completed' })
  status: 'completed' | 'upcoming';

  @Column()
  mainImage: string;

  @Column('simple-array', { nullable: true })
  galleryImages: string[];

  @Column({ nullable: true })
  organizer: string;

  @Column({ nullable: true })
  registrationUrl: string;

  @Column({ type: 'int', nullable: true })
  attendees: number;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  sponsors: EventSponsorTier[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export interface EventSponsorItem {
  id?: string;
  name?: string;
  logo: string;
  websiteUrl?: string;
}

export interface EventSponsorTier {
  id?: string;
  tier: string;
  sponsors: EventSponsorItem[];
}
