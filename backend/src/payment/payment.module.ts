import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [PaymentService, PrismaService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
