import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('popups')
export class Popup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  imageUrl: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'int', default: 3 })
  delaySeconds: number;

  @Column({ nullable: true })
  linkUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
