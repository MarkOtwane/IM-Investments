import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      storage: memoryStorage(), // Use memory storage for Cloudinary
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
