import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  addToCart(@Request() req: any, @Body(ValidationPipe) addToCartDto: AddToCartDto) {
    console.log('CartController: Adding to cart:', addToCartDto);
    console.log('CartController: User from request:', req.user);
    console.log('CartController: Request headers:', req.headers.authorization);
    const userId = req.user.userId;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Put(':cartItemId')
  @UseGuards(JwtAuthGuard)
  updateCartItem(
    @Request() req: any,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const userId = req.user.userId;
    return this.cartService.updateCartItem(userId, cartItemId, quantity);
  }

  @Delete(':cartItemId')
  @UseGuards(JwtAuthGuard)
  removeCartItem(
    @Request() req: any,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
  ) {
    const userId = req.user.userId;
    return this.cartService.removeCartItem(userId, cartItemId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req: any) {
    const userId = req.user.userId;
    return this.cartService.getCart(userId);
  }
}