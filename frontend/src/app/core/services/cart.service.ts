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

  addToCart(productId: string, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, { productId, quantity });
  }

  updateCartItem(cartItemId: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${cartItemId}`, { quantity });
  }

  removeFromCart(cartItemId: string): Observable<CartItem> {
    return this.http.delete<CartItem>(`${this.apiUrl}/${cartItemId}`);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }
}
