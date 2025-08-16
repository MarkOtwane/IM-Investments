/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@Request() req) {
    const userId = req.user.userId;
    return this.ordersService.getOrdersByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrder(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const userId = req.user.userId;
    const order = await this.ordersService.getOrderById(orderId);

    // Check if order exists
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Ensure the order belongs to the user
    if (order.userId !== userId) {
      throw new ForbiddenException('Order does not belong to user');
    }

    return order;
  }
}
