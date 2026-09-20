import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;
  private fallbackTransporter: Transporter | null = null;
  private readonly logger = new Logger(MailService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  /**
   * Helper to strip surrounding quotes if copied literally from .env files
   */
  private cleanString(val?: string): string {
    if (!val) return '';
    const trimmed = val.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  }

  /**
   * Lazily initialize Nodemailer transporter with robust cloud configuration and fallback.
   */
  private initTransporters(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const rawUser = this.configService.get<string>('SMTP_USER');
    const rawPass = this.configService.get<string>('SMTP_PASS');
    const smtpUser = this.cleanString(rawUser);
    const smtpPass = this.cleanString(rawPass);

    const host = this.cleanString(
      this.configService.get<string>('SMTP_HOST', 'smtp.hostinger.com'),
    );
    const rawPort = this.configService.get<number | string>('SMTP_PORT', 465);
    const primaryPort = Number(rawPort) || 465;

    const rawSecure = this.configService.get<string>('SMTP_SECURE');
    const isSecure =
      rawSecure !== undefined
        ? this.cleanString(rawSecure) === 'true'
        : primaryPort === 465;

    if (
      smtpUser &&
      smtpPass &&
      !smtpUser.includes('your-email') &&
      !smtpPass.includes('your-app-password')
    ) {
      try {
        // Primary Transporter (e.g. port 465 SSL)
        this.transporter = nodemailer.createTransport({
          host,
          port: primaryPort,
          secure: isSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10000, // 10s connection limit for cloud environments
          greetingTimeout: 10000,
          socketTimeout: 15000,
          tls: {
            rejectUnauthorized: false, // Prevents cloud SSL handshake rejects
            minVersion: 'TLSv1.2',
          },
        });

        // Fallback Transporter (port 587 STARTTLS if primary is 465, or 465 if primary is 587)
        const fallbackPort = primaryPort === 465 ? 587 : 465;
        const fallbackSecure = fallbackPort === 465;

        this.fallbackTransporter = nodemailer.createTransport({
          host,
          port: fallbackPort,
          secure: fallbackSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
          tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2',
          },
        });

        this.logger.log(
          `SMTP initialized: Primary ${host}:${primaryPort} (secure=${isSecure}), Fallback ${host}:${fallbackPort} (secure=${fallbackSecure}) for user: ${smtpUser}`,
        );
      } catch (err) {
        this.logger.error('Failed to initialize mail transporters:', err);
        this.transporter = null;
        this.fallbackTransporter = null;
      }
    } else {
      this.logger.warn(
        `⚠️ SMTP credentials missing or placeholder. SMTP_USER: ${smtpUser ? 'CONFIGURED' : 'NOT SET'}, SMTP_PASS: ${smtpPass ? 'CONFIGURED' : 'NOT SET'}. Ensure SMTP_USER, SMTP_PASS, SMTP_HOST, and SMTP_FROM are set in your Render environment dashboard.`,
      );
      this.transporter = null;
      this.fallbackTransporter = null;
    }
  }

  private getResendApiKey(): string {
    return this.cleanString(this.configService.get<string>('RESEND_API_KEY'));
  }

  private getBrevoApiKey(): string {
    return this.cleanString(this.configService.get<string>('BREVO_API_KEY'));
  }

  private getFromAddress(): string {
    const rawFrom =
      this.configService.get<string>('RESEND_FROM') ||
      this.configService.get<string>('SMTP_FROM');
    const customFrom = this.cleanString(rawFrom);
    if (customFrom) {
      return customFrom;
    }
    const user =
      this.cleanString(this.configService.get<string>('SMTP_USER')) ||
      'web@gccforums.org';
    return `"GCCF" <${user}>`;
  }

  private parseSenderEmail(fromStr: string): { name: string; email: string } {
    const match = fromStr.match(/"?([^"<]+)"?\s*<([^>]+)>/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { name: 'GCCF', email: fromStr.replace(/[<>]/g, '').trim() };
  }

  /**
   * Send email using Resend HTTPS REST API (Port 443).
   * Bypasses all cloud SMTP port restrictions (e.g. Render Free tier port 465/587 blocks).
   */
  private async sendViaResend(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ messageId: string }> {
    const apiKey = this.getResendApiKey();
    const from = this.getFromAddress();

    this.logger.log(
      `[MailService] Sending email to ${to} via Resend HTTPS API (from: ${from})...`,
    );

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const result: any = await response.json();

    if (!response.ok) {
      const errorMsg =
        result?.message || result?.error || JSON.stringify(result);
      this.logger.error(
        `[MailService] Resend API error (${response.status}): ${errorMsg}`,
      );
      throw new Error(`Resend API failed: ${errorMsg}`);
    }

    this.logger.log(
      `[MailService] Email delivered to ${to} via Resend (ID: ${result.id})`,
    );
    return { messageId: result.id };
  }

  /**
   * Send email using Brevo HTTPS REST API (Port 443).
   */
  private async sendViaBrevo(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ messageId: string }> {
    const apiKey = this.getBrevoApiKey();
    const { name, email } = this.parseSenderEmail(this.getFromAddress());

    this.logger.log(
      `[MailService] Sending email to ${to} via Brevo HTTPS API (from: ${email})...`,
    );

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name, email },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const result: any = await response.json();

    if (!response.ok) {
      const errorMsg =
        result?.message || result?.error || JSON.stringify(result);
      this.logger.error(
        `[MailService] Brevo API error (${response.status}): ${errorMsg}`,
      );
      throw new Error(`Brevo API failed: ${errorMsg}`);
    }

    this.logger.log(
      `[MailService] Email delivered to ${to} via Brevo (MessageID: ${result.messageId})`,
    );
    return { messageId: result.messageId };
  }

  /**
   * Primary dispatcher: Sends via HTTP API (Resend / Brevo) if keys configured,
   * otherwise falls back to Nodemailer SMTP.
   */
  private async sendMailWithFallback(mailOptions: nodemailer.SendMailOptions): Promise<any> {
    let targetEmail = '';
    if (typeof mailOptions.to === 'string') {
      targetEmail = mailOptions.to;
    } else if (Array.isArray(mailOptions.to) && mailOptions.to.length > 0) {
      const first = mailOptions.to[0];
      targetEmail = typeof first === 'string' ? first : (first as any).address;
    } else if (mailOptions.to && typeof mailOptions.to === 'object' && 'address' in mailOptions.to) {
      targetEmail = (mailOptions.to as any).address;
    }
    const subject = mailOptions.subject || 'GCCF Notification';
    const htmlContent = (mailOptions.html as string) || '';

    // 1. Try Resend HTTP API if configured
    if (this.getResendApiKey()) {
      try {
        return await this.sendViaResend(targetEmail, subject, htmlContent);
      } catch (resendErr: any) {
        this.logger.error(
          `[MailService] Resend API delivery failed: ${resendErr.message}`,
        );
        throw resendErr;
      }
    }

    // 2. Try Brevo HTTP API if configured
    if (this.getBrevoApiKey()) {
      try {
        return await this.sendViaBrevo(targetEmail, subject, htmlContent);
      } catch (brevoErr: any) {
        this.logger.error(
          `[MailService] Brevo API delivery failed: ${brevoErr.message}`,
        );
        throw brevoErr;
      }
    }

    // 3. Fallback to Nodemailer SMTP
    this.initTransporters();

    if (!this.transporter) {
      this.logger.warn(
        `[MailService] Cannot send email to ${mailOptions.to}: Neither HTTP Email API (RESEND_API_KEY/BREVO_API_KEY) nor SMTP credentials are configured.`,
      );
      return null;
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `[MailService] Email successfully delivered to ${mailOptions.to} via SMTP (MessageID: ${info.messageId})`,
      );
      return info;
    } catch (primaryError: any) {
      this.logger.warn(
        `[MailService] Primary SMTP delivery failed (${primaryError.message}). Attempting fallback port...`,
      );

      if (this.fallbackTransporter) {
        try {
          const info = await this.fallbackTransporter.sendMail(mailOptions);
          this.logger.log(
            `[MailService] Fallback SMTP delivered email to ${mailOptions.to} (MessageID: ${info.messageId})`,
          );
          this.transporter = this.fallbackTransporter;
          return info;
        } catch (fallbackError: any) {
          this.logger.error(
            `[MailService] Both primary and fallback SMTP failed for ${mailOptions.to}. Error: ${fallbackError.message}`,
            fallbackError.stack,
          );
          throw fallbackError;
        }
      } else {
        throw primaryError;
      }
    }
  }

  /**
   * Diagnostic verification method for testing email connectivity
   */
  async testSmtpConnection(): Promise<{
    success: boolean;
    provider?: string;
    message: string;
    host?: string;
    port?: number;
  }> {
    // 1. If Resend is configured, test Resend HTTPS connection
    const resendKey = this.getResendApiKey();
    if (resendKey) {
      try {
        const res = await fetch('https://api.resend.com/api-keys', {
          headers: { Authorization: `Bearer ${resendKey}` },
        });
        const data: any = await res.json();
        if (res.ok) {
          return {
            success: true,
            provider: 'Resend (HTTPS API Port 443)',
            message:
              'Connected to Resend HTTP API successfully! Emails will be delivered reliably via HTTPS.',
          };
        } else {
          return {
            success: false,
            provider: 'Resend',
            message: `Resend API validation failed: ${data.message || JSON.stringify(data)}`,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          provider: 'Resend',
          message: `Failed to connect to Resend API: ${err.message}`,
        };
      }
    }

    // 2. If Brevo is configured, test Brevo HTTPS connection
    const brevoKey = this.getBrevoApiKey();
    if (brevoKey) {
      try {
        const res = await fetch('https://api.brevo.com/v3/account', {
          headers: { 'api-key': brevoKey },
        });
        const data: any = await res.json();
        if (res.ok) {
          return {
            success: true,
            provider: 'Brevo (HTTPS API Port 443)',
            message:
              'Connected to Brevo HTTP API successfully! Emails will be delivered reliably via HTTPS.',
          };
        } else {
          return {
            success: false,
            provider: 'Brevo',
            message: `Brevo API validation failed: ${data.message || JSON.stringify(data)}`,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          provider: 'Brevo',
          message: `Failed to connect to Brevo API: ${err.message}`,
        };
      }
    }

    // 3. Fallback to testing SMTP
    this.initTransporters();

    const host = this.cleanString(
      this.configService.get<string>('SMTP_HOST', 'smtp.hostinger.com'),
    );
    const port = Number(this.configService.get<number>('SMTP_PORT', 465));

    if (!this.transporter) {
      return {
        success: false,
        provider: 'None',
        message:
          'No email service configured. Please set RESEND_API_KEY (recommended for Render) or define SMTP_USER, SMTP_PASS, SMTP_HOST in your environment.',
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        provider: 'Nodemailer SMTP',
        message: `SMTP connection to ${host}:${port} verified successfully!`,
        host,
        port,
      };
    } catch (err: any) {
      if (this.fallbackTransporter) {
        try {
          await this.fallbackTransporter.verify();
          const fallbackPort = port === 465 ? 587 : 465;
          return {
            success: true,
            provider: 'Nodemailer SMTP (Fallback)',
            message: `Primary port failed, but fallback SMTP to ${host}:${fallbackPort} verified successfully!`,
            host,
            port: fallbackPort,
          };
        } catch (fallbackErr: any) {
          const isTimeout =
            err.message?.includes('timeout') ||
            fallbackErr.message?.includes('timeout');
          return {
            success: false,
            provider: 'Nodemailer SMTP',
            message: isTimeout
              ? `Connection timeout on ports 465 and 587. Render Free Tier blocks outbound SMTP traffic (ports 25, 465, 587). To fix this, add a free RESEND_API_KEY in your Render environment variables to send emails via HTTPS port 443.`
              : `SMTP verification failed on both ports. Primary: ${err.message}. Fallback: ${fallbackErr.message}`,
          };
        }
      }
      return {
        success: false,
        provider: 'Nodemailer SMTP',
        message: `SMTP verification failed: ${err.message}`,
      };
    }
  }

  async sendMembershipApprovalEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const fullName = `${firstName} ${lastName}`;

    try {
      await this.sendMailWithFallback({
        from: this.getFromAddress(),
        to: email,
        subject: 'Welcome to GCCF - Your Membership has been Approved!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
            <div style="background: #1d3c68; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Global Cybersecurity Community Forum</h1>
            </div>
            <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #ffffff;">
              <h2 style="color: #1d3c68; margin-top: 0;">Welcome to GCCF!</h2>
              <p>Dear <strong>${fullName}</strong>,</p>
              <p>We are delighted to inform you that your application for membership in the Global Cybersecurity Community Forum (GCCF) has been <strong style="color: #10b981;">approved</strong>.</p>
              <div style="background: #f8fafc; border-left: 4px solid #3d73bd; padding: 16px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #475569;">
                  As a recognized GCCF member, you now have priority access to all community forums, research publications, networking roundtables, and technical workshops.
                </p>
              </div>
              <p>You will now receive regular newsletters and event invitations directly to this email.</p>
              <br/>
              <p style="margin-bottom: 4px;">Warm regards,</p>
              <p style="margin: 0;"><strong>The GCCF Executive Team</strong></p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">Global Cybersecurity Community Forum (GCCF)</p>
            </div>
          </div>
        `,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to send approval email to ${email}: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendMembershipDeclineEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const fullName = `${firstName} ${lastName}`;

    try {
      await this.sendMailWithFallback({
        from: this.getFromAddress(),
        to: email,
        subject: 'GCCF Membership Application Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
            <div style="background: #1d3c68; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Global Cybersecurity Community Forum</h1>
            </div>
            <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #ffffff;">
              <h2 style="color: #1d3c68; margin-top: 0;">Membership Application Update</h2>
              <p>Dear <strong>${fullName}</strong>,</p>
              <p>Thank you for your interest in joining the Global Cybersecurity Community Forum (GCCF).</p>
              <p>After careful evaluation by our committee, we regret to inform you that we are unable to approve your application at this current time.</p>
              <p>You are warmly welcomed to attend our open public workshops and participate in community discussions.</p>
              <br/>
              <p style="margin-bottom: 4px;">Best regards,</p>
              <p style="margin: 0;"><strong>The GCCF Membership Committee</strong></p>
            </div>
          </div>
        `,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to send decline email to ${email}: ${error.message}`,
        error.stack,
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
    try {
      await this.sendMailWithFallback({
        from: this.getFromAddress(),
        to: email,
        subject: `GCCF Event Announcement: ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
            <div style="background: #1d3c68; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Global Cybersecurity Community Forum</h1>
            </div>
            <div style="padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; background: #ffffff;">
              <h2 style="color: #1d3c68; margin-top: 0;">Upcoming Member Event</h2>
              <p>Dear <strong>${firstName}</strong>,</p>
              <p>We are excited to invite you to an exclusive GCCF event:</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1d3c68; font-size: 18px;">${eventTitle}</h3>
                <p style="margin: 6px 0;"><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 6px 0;"><strong>Location:</strong> ${eventLocation}</p>
                <p style="margin: 12px 0 0; color: #475569; font-size: 14px;">${eventDescription}</p>
              </div>
              <p>We look forward to seeing you there!</p>
              <br/>
              <p style="margin-bottom: 4px;">Best regards,</p>
              <p style="margin: 0;"><strong>The GCCF Team</strong></p>
            </div>
          </div>
        `,
      });
    } catch (error: any) {
      this.logger.error(
        `Failed to send newsletter email to ${email}: ${error.message}`,
        error.stack,
      );
    }
  }
}
