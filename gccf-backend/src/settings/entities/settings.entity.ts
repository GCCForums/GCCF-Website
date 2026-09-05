import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  accountSettings: {
    name?: string;
    email?: string;
    twoFactorEnabled?: boolean;
    lastLogin?: string;
    lastLoginIP?: string;
  };

  @Column({ type: 'jsonb', nullable: true, default: {} })
  securitySettings: {
    minPasswordLength?: number;
    requireSpecialChars?: boolean;
    requireNumbers?: boolean;
    requireUppercase?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    requireTwoFactor?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true, default: {} })
  analyticsSettings: {
    realTimeUpdates?: boolean;
    defaultDateRange?: string;
    displayedMetrics?: string[];
    exportFormat?: string;
  };

  @Column({ type: 'jsonb', nullable: true, default: {} })
  appearanceSettings: {
    theme?: string;
    primaryColor?: string;
    dashboardLayout?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
