import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsUrl,
  IsOptional,
} from 'class-validator';

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
}
