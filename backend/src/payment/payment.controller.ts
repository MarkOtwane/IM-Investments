/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  async initiatePayment(
    @Request() req,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    const userId = req.user.userId;
    return this.paymentService.initiatePayment(userId, phoneNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:orderId')
  async checkPaymentStatus(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.checkPaymentStatus(orderId);
  }
}
