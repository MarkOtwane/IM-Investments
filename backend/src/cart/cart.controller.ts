import {
  Body,
  Controller,
  Get,
  Post,
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
