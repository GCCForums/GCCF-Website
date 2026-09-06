import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Settings } from './entities/settings.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });

    if (!settings) {
      settings = this.settingsRepository.create({
        id: 1,
        accountSettings: {
          name: 'Admin User',
          email: 'admin@gccf.org',
          twoFactorEnabled: false,
          lastLogin: new Date().toISOString(),
          lastLoginIP: '192.168.1.100',
        },
        securitySettings: {
          minPasswordLength: 8,
          requireSpecialChars: true,
          requireNumbers: true,
          requireUppercase: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          lockoutDuration: 15,
          requireTwoFactor: false,
        },
        analyticsSettings: {
          realTimeUpdates: true,
          defaultDateRange: '30',
          displayedMetrics: ['members', 'news', 'events', 'gallery'],
          exportFormat: 'csv',
        },
        appearanceSettings: {
          theme: 'light',
          primaryColor: '#2563eb',
          dashboardLayout: 'default',
        },
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateAccountSettings(data: {
    name?: string;
    email?: string;
    twoFactorEnabled?: boolean;
    lastLogin?: string;
    lastLoginIP?: string;
  }): Promise<Settings> {
    const settings = await this.getSettings();
    settings.accountSettings = { ...settings.accountSettings, ...data };
    return this.settingsRepository.save(settings);
  }

  async updateSecuritySettings(data: {
    minPasswordLength?: number;
    requireSpecialChars?: boolean;
    requireNumbers?: boolean;
    requireUppercase?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    requireTwoFactor?: boolean;
  }): Promise<Settings> {
    const settings = await this.getSettings();
    settings.securitySettings = { ...settings.securitySettings, ...data };
    return this.settingsRepository.save(settings);
  }

  async updateAnalyticsSettings(data: {
    realTimeUpdates?: boolean;
    defaultDateRange?: string;
    displayedMetrics?: string[];
    exportFormat?: string;
  }): Promise<Settings> {
    const settings = await this.getSettings();
    settings.analyticsSettings = { ...settings.analyticsSettings, ...data };
    return this.settingsRepository.save(settings);
  }

  async updateAppearanceSettings(data: {
    theme?: string;
    primaryColor?: string;
    dashboardLayout?: string;
  }): Promise<Settings> {
    const settings = await this.getSettings();
    settings.appearanceSettings = { ...settings.appearanceSettings, ...data };
    return this.settingsRepository.save(settings);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const admin = await this.adminRepository.findOne({
      where: { username: 'admin' },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await this.adminRepository.save(admin);
    return { success: true, message: 'Password changed successfully' };
  }

  logoutAllSessions(): { success: boolean; message: string } {
    return { success: true, message: 'All sessions logged out successfully' };
  }
}
