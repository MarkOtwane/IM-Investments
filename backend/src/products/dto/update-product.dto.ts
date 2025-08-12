/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsInt,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsInt({ message: 'Stock must be a valid integer' })
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsInt({ message: 'Category ID must be a valid integer' })
  @IsOptional()
  categoryId?: number;
}
