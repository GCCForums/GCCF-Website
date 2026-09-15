import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Index()
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ nullable: true, default: 'Individual Member' })
  membershipType: string;

  @Column({ type: 'text', nullable: true })
  paymentAttachment: string;

  @Index()
  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'declined';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
