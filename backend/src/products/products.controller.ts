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
        if (file && file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else if (file) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true); // Allow no file
        }
      },
    }),
  )
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received product data:', createProductDto);
    console.log('Received file:', file);

    try {
      // Convert string values to appropriate types if needed
      const productData = {
        name: createProductDto.name,
        description: createProductDto.description,
        price: typeof createProductDto.price === 'string' 
          ? parseFloat(createProductDto.price) 
          : createProductDto.price,
        stock: typeof createProductDto.stock === 'string' 
          ? parseInt(createProductDto.stock, 10) 
          : createProductDto.stock,
        categoryId: typeof createProductDto.categoryId === 'string' 
          ? parseInt(createProductDto.categoryId, 10) 
          : createProductDto.categoryId,
        imageUrl: createProductDto.imageUrl || '',
      };

      // If an image file is uploaded, upload it to Cloudinary
      if (file) {
        try {
          const imageUrl = await this.cloudinaryService.uploadImage(file);
          productData.imageUrl = imageUrl;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          // Don't fail the entire request, just use default image
          productData.imageUrl = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
        }
      } else if (!productData.imageUrl) {
        // Set a default image URL if no image is provided
        productData.imageUrl = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
      }

      console.log('Final product data:', productData);
      return this.productsService.create(productData);
    } catch (error) {
      console.error('Product creation error:', error);
      throw new BadRequestException('Failed to create product: ' + error.message);
    }
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
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
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file && file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else if (file) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Updating product:', id, updateProductDto);
    console.log('Update file:', file);

    try {
      const updateData = {
        ...updateProductDto,
        price: updateProductDto.price && typeof updateProductDto.price === 'string'
          ? parseFloat(updateProductDto.price)
          : updateProductDto.price,
        stock: updateProductDto.stock && typeof updateProductDto.stock === 'string'
          ? parseInt(updateProductDto.stock, 10)
          : updateProductDto.stock,
        categoryId: updateProductDto.categoryId && typeof updateProductDto.categoryId === 'string'
          ? parseInt(updateProductDto.categoryId, 10)
          : updateProductDto.categoryId,
      };

      if (file) {
        try {
          const imageUrl = await this.cloudinaryService.uploadImage(file);
          updateData.imageUrl = imageUrl;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          // Continue without updating image if upload fails
        }
      }

      return this.productsService.update(id, updateData);
    } catch (error) {
      console.error('Product update error:', error);
      throw new BadRequestException('Failed to update product: ' + error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}