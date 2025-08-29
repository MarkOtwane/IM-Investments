import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async create(name: string) {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      throw new BadRequestException('Category name is required');
    }
    try {
      return await this.prisma.category.create({ data: { name: trimmed } });
    } catch (e: any) {
      // Unique constraint on name
      throw new BadRequestException('Category already exists');
    }
  }
}
