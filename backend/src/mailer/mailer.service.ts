/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './interface/mail-options.interface'; // should refer to mailOptions in the mailer folder
import { getPasswordResetTemplate } from './templates/password-reset.template';
import {
  getPaymentConfirmationTemplate,
  PaymentConfirmationData,
} from './templates/payment-confirmation.template';
import { getWelcomeTemplate } from './templates/welcome.template';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private provider: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>('MAILER_PROVIDER') ?? 'smtp';

    if (this.provider === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        secure: false, // Use STARTTLS
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
        tls: {
          rejectUnauthorized: false, // For development
        },
      });

      // Test email configuration on startup
      this.testEmailConfiguration();
    } else {
      // If using a provider like Brevo we won't initialize nodemailer transporter
      this.transporter = null;
      console.log(`Using mailer provider: ${this.provider}`);
    }
  }

  private async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
    } catch (error) {
      console.error('❌ Email service configuration error:', error);
      console.log(
        '📧 Email features will be disabled. Please check your SMTP configuration.',
      );
    }
  }

  async sendMail(options: MailOptions) {
    if (this.provider === 'brevo') {
      await this.sendWithBrevo(options);
      return;
    }

    // default to smtp
    if (!this.transporter) {
      console.error('SMTP transporter not configured');
      return;
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', options.to);
    } catch (error) {
      console.error('Failed to send email via SMTP:', error);
      console.log(
        '📧 Email sending failed, but continuing with main operation',
      );
    }
  }

  /**
   * Resend an email using the configured provider. This is a simple wrapper
   * around `sendMail` intended for retry/resend flows.
   */
  async resendMail(options: MailOptions) {
    console.log('Attempting to resend email to', options.to);
    await this.sendMail(options);
  }

  private async sendWithBrevo(options: MailOptions) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const senderEmail =
      this.configService.get<string>('BREVO_SENDER') ??
      this.configService.get<string>('SMTP_FROM');
    const senderName =
      this.configService.get<string>('BREVO_SENDER_NAME') ?? '';

    if (!apiKey) {
      console.error('BREVO_API_KEY not configured');
      return;
    }

    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    } as any;

    try {
      const res = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        payload,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
        },
      );

      console.log(
        '✅ Email sent via Brevo to:',
        options.to,
        'responseId:',
        res.data?.messageId ?? res.data?.id ?? 'n/a',
      );
    } catch (error) {
      console.error(
        'Failed to send email via Brevo:',
        error?.response?.data ?? error.message ?? error,
      );
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const baseUrl = this.configService.get<string>('APP_BASE_URL') ?? '';
    const { subject, text, html } = getPasswordResetTemplate(
      resetToken,
      baseUrl,
    );

    await this.sendMail({
      to: email,
      subject,
      text,
      html,
    });
  }

  async sendWelcomeEmail(email: string) {
    const { subject, text, html } = getWelcomeTemplate(email);

    await this.sendMail({
      to: email,
      subject,
      text,
      html,
    });
  }

  async sendPaymentConfirmationEmail(data: PaymentConfirmationData) {
    const { subject, text, html } = getPaymentConfirmationTemplate(data);

    await this.sendMail({
      to: data.customerEmail,
      subject,
      text,
      html,
    });
  }
}

// Test email sending:

//     Use Mailtrap or a similar service for local testing.
//     Trigger POST http://localhost:3000/auth/password-reset with { "email": "test@example.com" } in Postman and verify the email in Mailtrap.
