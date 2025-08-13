import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Multer } from 'multer';
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile() file?: Multer.File,
  ) {
    console.log('Received product data:', createProductDto);
    console.log('Received file:', file);

    // Convert string values to appropriate types
    const productData = {
      ...createProductDto,
      price:
        typeof createProductDto.price === 'string'
          ? parseFloat(createProductDto.price)
          : createProductDto.price,
      stock:
        typeof createProductDto.stock === 'string'
          ? parseInt(createProductDto.stock, 10)
          : createProductDto.stock,
      categoryId:
        typeof createProductDto.categoryId === 'string'
          ? parseInt(createProductDto.categoryId, 10)
          : createProductDto.categoryId,
    };

    // If an image file is uploaded, upload it to Cloudinary and update the imageUrl
    if (file) {
      try {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        productData.imageUrl = imageUrl;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new BadRequestException('Failed to upload image');
      }
    } else if (!productData.imageUrl) {
      // Set a default image URL if no image is provided
      productData.imageUrl =
        'https://via.placeholder.com/300x200?text=No+Image';
    }

    return this.productsService.create(productData);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
  ) {
    const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productsService.findAll(search, page, limit, categoryIdNumber);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Multer.File,
  ) {
    console.log('Updating product:', id, updateProductDto);
    console.log('Update file:', file);

    // Convert string values to appropriate types
    const updateData = {
      ...updateProductDto,
      price:
        updateProductDto.price && typeof updateProductDto.price === 'string'
          ? parseFloat(updateProductDto.price)
          : updateProductDto.price,
      stock:
        updateProductDto.stock && typeof updateProductDto.stock === 'string'
          ? parseInt(updateProductDto.stock, 10)
          : updateProductDto.stock,
      categoryId:
        updateProductDto.categoryId &&
        typeof updateProductDto.categoryId === 'string'
          ? parseInt(updateProductDto.categoryId, 10)
          : updateProductDto.categoryId,
    };

    // If an image file is uploaded, upload it to Cloudinary and update the imageUrl
    if (file) {
      try {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updateData.imageUrl = imageUrl;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new BadRequestException('Failed to upload image');
      }
    }

    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
