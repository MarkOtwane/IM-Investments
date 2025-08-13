import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, CartItem } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => console.error('Failed to load cart', err),
    });
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateCartItem(cartItem.id, quantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to update item quantity', err),
    });
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove item', err),
    });
  }

  getTotalPrice(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
