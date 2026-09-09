import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface HeroSectionContent {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface MetricItem {
  number: string;
  label: string;
}

export interface MetricsSectionContent {
  backgroundImage?: string;
  items: MetricItem[];
}

export interface AboutSectionContent {
  badge?: string;
  title?: string;
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionContent {
  badge?: string;
  title?: string;
  items: FaqItem[];
}

@Entity('homepage_content')
export class HomepageContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  hero: HeroSectionContent;

  @Column({ type: 'jsonb', nullable: true })
  metrics: MetricsSectionContent;

  @Column({ type: 'jsonb', nullable: true })
  about: AboutSectionContent;

  @Column({ type: 'jsonb', nullable: true })
  faq: FaqSectionContent;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  extraSections: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
