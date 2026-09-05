import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ type: 'date' })
  eventDate: Date;

  @Column()
  location: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'completed' })
  status: 'completed' | 'upcoming';

  @Column()
  mainImage: string;

  @Column('simple-array', { nullable: true })
  galleryImages: string[];

  @Column({ nullable: true })
  organizer: string;

  @Column({ type: 'int', nullable: true })
  attendees: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}