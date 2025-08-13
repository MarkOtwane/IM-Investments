import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async initiatePayment(userId: number, phoneNumber: string) {
    try {
      // Get cart and calculate total
      const cart = await this.cartService.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }

      const totalAmount = cart.items.reduce(
        (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

      // Create order
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount,
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

      return {
        orderId: order.id,
        message: 'Payment initiated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
