import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  addToCart(productId: number, quantity: number): Observable<CartItem> {
    console.log('CartService: Adding to cart', { productId, quantity });
    return this.http.post<CartItem>(this.apiUrl, { productId, quantity });
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<CartItem> {
    console.log('CartService: Updating cart item', { cartItemId, quantity });
    return this.http.put<CartItem>(`${this.apiUrl}/${cartItemId}`, { quantity });
  }

  removeFromCart(cartItemId: number): Observable<void> {
    console.log('CartService: Removing from cart', { cartItemId });
    return this.http.delete<void>(`${this.apiUrl}/${cartItemId}`);
  }

  getCart(): Observable<Cart> {
    console.log('CartService: Getting cart');
    return this.http.get<Cart>(this.apiUrl);
  }
}