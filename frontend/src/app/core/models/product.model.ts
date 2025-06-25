export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt'>;
