import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './interface/mail-options.interface'; // should refer to mailOptions in the mailer folder
import { getPasswordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // Use TLS
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
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
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
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
}

// Test email sending:

//     Use Mailtrap or a similar service for local testing.
//     Trigger POST http://localhost:3000/auth/password-reset with { "email": "test@example.com" } in Postman and verify the email in Mailtrap.
