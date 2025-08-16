import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const { productId, quantity } = dto;
    console.log('CartService: Adding to cart', { userId, productId, quantity });

    try {
      // Check if product exists and has enough stock
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
        );
      }

      // Find or create cart for user
      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
        });
      }

      // Check if product is already in cart
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (existingCartItem) {
        // Update quantity
        const newQuantity = existingCartItem.quantity + quantity;
        if (product.stock < newQuantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Total requested: ${newQuantity}`,
          );
        }

        return this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: newQuantity },
          include: {
            product: true,
          },
        });
      } else {
        // Add new cart item
        return this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
          include: {
            product: true,
          },
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(userId: number, cartItemId: number, quantity: number) {
    // Check if cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    if (cartItem.cart.userId !== userId) {
      throw new BadRequestException('Cart item does not belong to user');
    }

    if (!cartItem.product) {
      throw new NotFoundException(`Product not found for cart item ${cartItemId}`);
    }

    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${cartItem.product.name}`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeCartItem(userId: number, cartItemId: number) {
    // Check if cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    if (cartItem.cart.userId !== userId) {
      throw new BadRequestException('Cart item does not belong to user');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { id: null, userId, items: [] };
    }

    return cart;
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) {
      return { cleared: 0 };
    }
    const result = await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { cleared: result.count };
  }
}