import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsUrl,
  IsOptional,
  ValidateIf,
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

  @IsOptional()
  @ValidateIf((object: CreateProductDto) => object.imageUrl !== '')
  @IsUrl()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  categoryId: number;
}
