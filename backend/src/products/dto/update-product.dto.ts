import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => typeof value === 'string' ? parseFloat(value) : value)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt({ message: 'Stock must be a valid integer' })
  @Min(0)
  @IsOptional()
  stock?: number;

  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  @IsInt({ message: 'Category ID must be a valid integer' })
  @IsOptional()
  categoryId?: number;
}