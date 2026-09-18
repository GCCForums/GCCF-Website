import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Index()
  @Column({ default: true })
  isVisible: boolean;

  @Index()
  @Column({ type: 'int', default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
