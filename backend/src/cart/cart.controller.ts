/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
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
  addToCart(@Request() req, @Body(ValidationPipe) addToCartDto: AddToCartDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId; // Extracted from JWT payload
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Put(':cartItemId')
  @UseGuards(JwtAuthGuard)
  updateCartItem(
    @Request() req,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId; // Extracted from JWT payload
    return this.cartService.updateCartItem(userId, cartItemId, quantity);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId; // Extracted from JWT payload
    return this.cartService.getCart(userId);
  }
}

// Test endpoints in Postman:

//     POST http://localhost:3000/cart (with JWT) with { "productId": 1, "quantity": 2 }.
//     GET http://localhost:3000/cart (with JWT) to retrieve cart contents.
//     PUT http://localhost:3000/cart/:cartItemId (with JWT) with { "quantity": 3 }.
