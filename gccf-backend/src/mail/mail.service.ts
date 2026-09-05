import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;
  private readonly logger = new Logger(MailService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.isConfigured = true;
    } else {
      this.logger.warn('SMTP credentials not configured. Email sending is disabled.');
    }
  }

  async sendMembershipApprovalEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn(`Skipping approval email to ${email}: SMTP not configured`);
      return;
    }
    
    const fullName = `${firstName} ${lastName}`;
    
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM', 'noreply@gccf.com'),
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
  }

  async sendMembershipDeclineEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn(`Skipping decline email to ${email}: SMTP not configured`);
      return;
    }
    
    const fullName = `${firstName} ${lastName}`;
    
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM', 'noreply@gccf.com'),
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
  }

  async sendNewsletterToMember(
    email: string,
    firstName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    eventDescription: string,
  ): Promise<void> {
    if (!this.isConfigured || !this.transporter) {
      this.logger.warn(`Skipping newsletter email to ${email}: SMTP not configured`);
      return;
    }
    
    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM', 'noreply@gccf.com'),
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
  }
}