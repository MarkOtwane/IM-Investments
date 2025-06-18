import { Body, Controller, Post } from '@nestjs/common';
import { sendEmailDto } from './dto/mailer.dto';
import { MailerService } from './mailer.service';

@Controller('email')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendMail(@Body() dto: sendEmailDto) {
    await this.mailerService.sendEmail(dto);
    return { message: 'Email sent successfully' };
  }
}
