/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  private getMpesaConfig() {
    return {
      consumerKey: this.configService.get<string>('MPESA_CONSUMER_KEY'),
      consumerSecret: this.configService.get<string>('MPESA_CONSUMER_SECRET'),
      shortcode: this.configService.get<string>('MPESA_SHORTCODE'),
      passkey: this.configService.get<string>('MPESA_PASSKEY'),
      stkUrl: this.configService.get<string>('MPESA_STK_URL'),
      tokenUrl: this.configService.get<string>('MPESA_TOKEN_URL'),
      callbackUrl: this.configService.get<string>('MPESA_CALLBACK_URL'),
    };
  }

  async getAccessToken(): Promise<string> {
    const { consumerKey, consumerSecret, tokenUrl } = this.getMpesaConfig();
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
      const response = await axios.get(tokenUrl, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get M-Pesa access token:', error);
      throw new HttpException('Failed to authenticate with M-Pesa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '');
  }

  getPassword(shortcode: string, passkey: string, timestamp: string): string {
    const passwordString = shortcode + passkey + timestamp;
    return Buffer.from(passwordString).toString('base64');
  }

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

      // M-Pesa STK Push
      const { shortcode, stkUrl, callbackUrl } = this.getMpesaConfig();
      const timestamp = this.getTimestamp();
      const password = this.getPassword(shortcode, this.configService.get<string>('MPESA_PASSKEY'), timestamp);
      const token = await this.getAccessToken();

      const stkPayload = {
        BusinessShortCode: parseInt(shortcode),
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(totalAmount),
        PartyA: phoneNumber.replace(/^\+?254|0/, '254'),
        PartyB: parseInt(shortcode),
        PhoneNumber: phoneNumber.replace(/^\+?254|0/, '254'),
        CallBackURL: callbackUrl,
        AccountReference: 'IM Investments',
        TransactionDesc: `Payment for order ${order.id}`,
      };

      try {
        const response = await axios.post(stkUrl, stkPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.ResponseCode === '0') {
          // Update payment with checkout request ID
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { checkoutRequestId: response.data.CheckoutRequestID },
          });
        } else {
          throw new HttpException('M-Pesa STK push failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } catch (mpesaError) {
        console.error('M-Pesa STK push error:', mpesaError);
        // Rollback order and payment if STK fails
        await this.prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        await this.prisma.order.delete({ where: { id: order.id } });
        await this.prisma.payment.delete({ where: { id: payment.id } });
        throw new HttpException('Failed to initiate M-Pesa payment', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Clear cart after successful STK initiation
      await this.cartService.clearCart(userId);

      // Send initiation email (preliminary)
      try {
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
          console.log('Payment initiation email sent to:', user.email);
        }
      } catch (emailError) {
        console.error('Failed to send payment initiation email:', emailError);
      }

      return {
        orderId: order.id,
        checkoutRequestId: response.data.CheckoutRequestID,
        message: 'M-Pesa STK push initiated successfully. Please complete payment on your phone. Cart cleared.',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleCallback(checkoutRequestId: string, callbackData: any) {
    try {
      const payment = await this.prisma.payment.findFirst({
        where: { checkoutRequestId },
        include: { order: true },
      });

      if (!payment) {
        console.log('Payment not found for callback:', checkoutRequestId);
        return;
      }

      // Parse callback (assuming callbackData is the body from M-Pesa)
      const resultCode = callbackData.Body.stkCallback.ResultCode;
      const resultDesc = callbackData.Body.stkCallback.ResultDesc;

      if (resultCode === 0) {
        // Success
        const checkout = callbackData.Body.stkCallback.CallbackMetadata || [];
        const amount = checkout.find((item: any) => item.Name === 'Amount')?.Value || 0;
        const receipt = checkout.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value || '';

        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            transactionId: receipt,
            mpesaResponse: callbackData,
          },
        });

        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED' },
        });

        // Send confirmation email
        const user = await this.prisma.user.findUnique({
          where: { id: payment.order.userId },
          select: { email: true },
        });

        if (user) {
          const order = await this.prisma.order.findUnique({
            where: { id: payment.orderId },
            include: { items: { include: { product: true } } },
          });

          const paymentConfirmationData = {
            customerEmail: user.email,
            orderId: payment.orderId,
            totalAmount: amount,
            items: order?.items.map((item) => ({
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })) || [],
            paymentDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            mpesaReceipt: receipt,
          };

          await this.mailerService.sendPaymentConfirmationEmail(paymentConfirmationData);
          console.log('Payment confirmed and email sent for order:', payment.orderId);
        }
      } else {
        // Failed
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            mpesaResponse: callbackData,
          },
        });

        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'CANCELLED' },
        });

        console.log(`Payment failed for order ${payment.orderId}: ${resultDesc}`);
      }
    } catch (error) {
      console.error('Error handling M-Pesa callback:', error);
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
      orderStatus: payment.order.status,
      orderId: payment.orderId,
      transactionId: payment.transactionId,
    };
  }
}
