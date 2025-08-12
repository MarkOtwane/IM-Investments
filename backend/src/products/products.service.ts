/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Build the data object dynamically
    const data: any = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      categoryId: createProductDto.categoryId,
      // Set a default empty string for imageUrl if not provided
      imageUrl: createProductDto.imageUrl || '',
    };

    return this.prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async findAll(search?: string, page = 1, limit = 10, categoryId?: number) {
    const skip = (page - 1) * limit;
    let where: any = {};

    // Optional search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Optional category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Transform UpdateProductDto to match Prisma's expected input
    const updateData: any = {};

    if (updateProductDto.name) {
      updateData.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      updateData.description = updateProductDto.description;
    }
    if (updateProductDto.price !== undefined) {
      updateData.price = updateProductDto.price;
    }
    if (updateProductDto.imageUrl) {
      updateData.imageUrl = updateProductDto.imageUrl;
    }
    if (updateProductDto.stock !== undefined) {
      updateData.stock = updateProductDto.stock;
    }
    if (updateProductDto.categoryId) {
      updateData.categoryId = updateProductDto.categoryId;
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
