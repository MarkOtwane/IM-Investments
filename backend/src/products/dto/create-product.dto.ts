/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsUrl,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsEnum(Category, {
    message:
      'Category must be one of: CLOTHING, ELECTRONICS, HOME_KITCHEN, BEAUTY',
  })
  category: Category;
}
