import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt({ message: 'Stock must be a valid integer' })
  @Min(0)
  stock: number;

  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt({ message: 'Category ID must be a valid integer' })
  categoryId: number;
}