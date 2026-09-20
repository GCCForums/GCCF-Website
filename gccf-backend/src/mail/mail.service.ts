import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;
  private readonly logger = new Logger(MailService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  /**
   * Lazily initialize Nodemailer transporter on first send instead of blocking boot.
   */
  private getTransporter(): Transporter | null {
    if (this.isInitialized) {
      return this.transporter;
    }
    this.isInitialized = true;

    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (
      smtpUser &&
      smtpPass &&
      !smtpUser.includes('your-email') &&
      !smtpPass.includes('your-app-password')
    ) {
      try {
        const port = Number(this.configService.get<number>('SMTP_PORT', 465));
        const secureEnv = this.configService.get<string>('SMTP_SECURE');
        const isSecure =
          secureEnv !== undefined ? secureEnv === 'true' : port === 465;

        this.transporter = nodemailer.createTransport({
          host: this.configService.get<string>(
            'SMTP_HOST',
            'smtp.hostinger.com',
          ),
          port,
          secure: isSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        this.logger.log('SMTP mail transporter lazily initialized.');
      } catch (err) {
        this.logger.error('Failed to initialize mail transporter:', err);
        this.transporter = null;
      }
    } else {
      this.logger.warn(
        'SMTP credentials not configured or using placeholder credentials. Email delivery is safely skipped.',
      );
      this.transporter = null;
    }
    return this.transporter;
  }

  private getFromAddress(): string {
    const customFrom = this.configService.get<string>('SMTP_FROM');
    if (customFrom && customFrom.trim()) {
      return customFrom;
    }
    const user = this.configService.get<string>('SMTP_USER', 'info@gccf.org');
    return `"GCCF" <${user}>`;
  }

  async sendMembershipApprovalEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `Skipping approval email to ${email}: SMTP not configured`,
      );
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    try {
      await transporter.sendMail({
        from: this.getFromAddress(),
        to: email,
        subject: 'Welcome to GCCF - Your Membership has been Approved!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d47a1;">Welcome to GCCF!</h2>
            <p>Dear ${fullName},</p>
            <p>We are pleased to inform you that your membership application has been <strong>approved</strong>.</p>
            <p>Welcome to the GCCF community! You will now receive newsletters about our upcoming events and activities.</p>
            <p>We look forward to your active participation in our community.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The GCCF Team</strong></p>
          </div>
        `,
      });
      this.logger.log(`Membership approval email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send approval email to ${email}: ${(error as Error).message}`,
      );
    }
  }

  async sendMembershipDeclineEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `Skipping decline email to ${email}: SMTP not configured`,
      );
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    try {
      await transporter.sendMail({
        from: this.getFromAddress(),
        to: email,
        subject: 'GCCF Membership Application Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d47a1;">GCCF Membership Application Update</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for your interest in joining the GCCF community.</p>
            <p>After careful review, we regret to inform you that your membership application could not be approved at this time.</p>
            <p>We encourage you to stay connected with us through our public events and activities.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The GCCF Team</strong></p>
          </div>
        `,
      });
      this.logger.log(`Membership decline email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send decline email to ${email}: ${(error as Error).message}`,
      );
    }
  }

  async sendNewsletterToMember(
    email: string,
    firstName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    eventDescription: string,
  ): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `Skipping newsletter email to ${email}: SMTP not configured`,
      );
      return;
    }

    try {
      await transporter.sendMail({
        from: this.getFromAddress(),
        to: email,
        subject: `GCCF Upcoming Event: ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d47a1;">GCCF Newsletter - Upcoming Event</h2>
            <p>Dear ${firstName},</p>
            <p>We're excited to invite you to our upcoming event!</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0d47a1;">${eventTitle}</h3>
              <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
              <p>${eventDescription}</p>
            </div>
            <p>We look forward to seeing you there!</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The GCCF Team</strong></p>
          </div>
        `,
      });
      this.logger.log(`Newsletter email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send newsletter email to ${email}: ${(error as Error).message}`,
      );
    }
  }
}
