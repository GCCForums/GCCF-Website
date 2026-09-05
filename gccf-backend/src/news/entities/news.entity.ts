import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  excerpt: string;

  @Column({ type: 'date' })
  publishedDate: Date;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  category: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  featuredImage: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  sourceUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}