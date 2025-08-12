import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt({ message: 'Stock must be a valid integer' })
  @Min(0)
  stock: number;

  @IsInt({ message: 'Category ID must be a valid integer' })
  categoryId: number;
}
