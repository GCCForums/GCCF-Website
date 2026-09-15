import { Controller, Get, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put('account')
  async updateAccountSettings(
    @Body()
    data: {
      name?: string;
      email?: string;
      twoFactorEnabled?: boolean;
      lastLogin?: string;
      lastLoginIP?: string;
    },
  ) {
    return this.settingsService.updateAccountSettings(data);
  }

  @Put('security')
  async updateSecuritySettings(
    @Body()
    data: {
      minPasswordLength?: number;
      requireSpecialChars?: boolean;
      requireNumbers?: boolean;
      requireUppercase?: boolean;
      sessionTimeout?: number;
      maxLoginAttempts?: number;
      lockoutDuration?: number;
      requireTwoFactor?: boolean;
    },
  ) {
    return this.settingsService.updateSecuritySettings(data);
  }

  @Put('analytics')
  async updateAnalyticsSettings(
    @Body()
    data: {
      realTimeUpdates?: boolean;
      defaultDateRange?: string;
      displayedMetrics?: string[];
      exportFormat?: string;
    },
  ) {
    return this.settingsService.updateAnalyticsSettings(data);
  }

  @Put('appearance')
  async updateAppearanceSettings(
    @Body()
    data: {
      theme?: string;
      primaryColor?: string;
      dashboardLayout?: string;
    },
  ) {
    return this.settingsService.updateAppearanceSettings(data);
  }

  @Get('membership')
  async getMembershipSettings() {
    return this.settingsService.getMembershipSettings();
  }

  @Put('membership')
  async updateMembershipSettings(
    @Body()
    data: {
      badge?: string;
      title?: string;
      subtitle?: string;
      formTitle?: string;
      formDescription?: string;
      membershipTypes?: string[];
      paymentInstructions?: string;
      qrCodeUrl?: string;
    },
  ) {
    return this.settingsService.updateMembershipSettings(data);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() data: { currentPassword: string; newPassword: string },
  ) {
    const username = req?.user?.username || 'admin';
    return this.settingsService.changePassword(
      username,
      data.currentPassword,
      data.newPassword,
    );
  }

  @Post('logout-all-sessions')
  logoutAllSessions() {
    return this.settingsService.logoutAllSessions();
  }
}
