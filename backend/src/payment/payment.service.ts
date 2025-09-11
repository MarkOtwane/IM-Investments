/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private mailerService: MailerService,
  ) {}

  async initiatePayment(userId: number, phoneNumber: string) {
    try {
      // Get cart and calculate total
      const cart = await this.cartService.getCart(userId);
      if (!cart || !cart.items || cart.items.length === 0) {
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }

      let totalAmount = 0;
      for (const item of cart.items) {
        totalAmount += (item.product?.price || 0) * item.quantity;
      }

      // Create order
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount: totalAmount,
          status: 'PENDING',
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product?.price || 0,
            })),
          },
        },
      });

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          phoneNumber,
          status: 'PENDING',
        },
      });

      // Clear cart items immediately after initiating payment (simulate auto-removal upon payment)
      await this.cartService.clearCart(userId);

      // Send payment confirmation email
      try {
        // Get user email
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });

        if (user) {
          const paymentConfirmationData = {
            customerEmail: user.email,
            orderId: order.id,
            totalAmount: totalAmount,
            items: cart.items.map((item: any) => ({
              productName: item.product?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.product?.price || 0,
            })),
            paymentDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          await this.mailerService.sendPaymentConfirmationEmail(paymentConfirmationData);
          console.log('Payment confirmation email sent successfully to:', user.email);
        }
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
        // Don't fail payment if email fails
      }

      return {
        orderId: order.id,
        message: 'Payment initiated successfully. Cart cleared.',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkPaymentStatus(orderId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: payment.status,
      orderId: payment.orderId,
    };
  }
}
