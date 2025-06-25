import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    // Check if product exists and has enough stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${product.name}`,
      );
    }

    // Use transaction to ensure atomicity
    return this.prisma.$transaction(async (prisma) => {
      // Reduce product stock
      await prisma.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity },
      });

      // Find or create cart for user
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: Number(userId) },
        });
      }

      // Check if product is already in cart
      const existingCartItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });

      if (existingCartItem) {
        // Update quantity
        return prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        // Add new cart item
        return prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }
    });
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true, // Include product details
          },
        },
      },
    });

    if (!cart) {
      return { id: null, items: [] };
    }

    return cart;
  }
}
