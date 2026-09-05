import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put('account')
  async updateAccountSettings(@Body() data: {
    name?: string;
    email?: string;
    twoFactorEnabled?: boolean;
    lastLogin?: string;
    lastLoginIP?: string;
  }) {
    return this.settingsService.updateAccountSettings(data);
  }

  @Put('security')
  async updateSecuritySettings(@Body() data: {
    minPasswordLength?: number;
    requireSpecialChars?: boolean;
    requireNumbers?: boolean;
    requireUppercase?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    requireTwoFactor?: boolean;
  }) {
    return this.settingsService.updateSecuritySettings(data);
  }

  @Put('analytics')
  async updateAnalyticsSettings(@Body() data: {
    realTimeUpdates?: boolean;
    defaultDateRange?: string;
    displayedMetrics?: string[];
    exportFormat?: string;
  }) {
    return this.settingsService.updateAnalyticsSettings(data);
  }

  @Put('appearance')
  async updateAppearanceSettings(@Body() data: {
    theme?: string;
    primaryColor?: string;
    dashboardLayout?: string;
  }) {
    return this.settingsService.updateAppearanceSettings(data);
  }

  @Post('change-password')
  async changePassword(@Body() data: { currentPassword: string; newPassword: string }) {
    return this.settingsService.changePassword(data.currentPassword, data.newPassword);
  }

  @Post('logout-all-sessions')
  async logoutAllSessions() {
    return this.settingsService.logoutAllSessions();
  }
}
