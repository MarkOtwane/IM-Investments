export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
  category: Category;
  createdAt: string;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'category'>;
