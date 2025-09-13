/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './interface/mail-options.interface'; // should refer to mailOptions in the mailer folder
import { getPasswordResetTemplate } from './templates/password-reset.template';
import { getWelcomeTemplate } from './templates/welcome.template';
import { getPaymentConfirmationTemplate, PaymentConfirmationData } from './templates/payment-confirmation.template';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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
      console.error('Failed to send email:', error);
      // Don't throw error to prevent breaking the main flow
      console.log(
        '📧 Email sending failed, but continuing with main operation',
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
