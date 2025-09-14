import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartModule } from '../cart/cart.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ConfigModule, CartModule, MailerModule],
  providers: [PaymentService, PrismaService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
