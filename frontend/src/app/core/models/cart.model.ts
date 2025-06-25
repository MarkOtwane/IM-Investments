import { Product } from "./product.model";

export interface CartItem {
  cartId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
