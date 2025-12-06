import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResendEmailDto } from './dto/resend-email.dto';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(@Body() dto: ResendEmailDto) {
    await this.mailerService.resendMail({
      to: dto.to,
      subject: dto.subject,
      text: dto.text,
      html: dto.html,
    });

    return { success: true, message: 'Resend triggered' };
  }
}
