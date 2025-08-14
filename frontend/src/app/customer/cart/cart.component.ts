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
  loading = true;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.error = null;
    
    this.cartService.getCart().subscribe({
      next: (cart) => {
        console.log('Cart loaded:', cart);
        this.cart = cart;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.error = 'Failed to load cart';
        this.loading = false;
      },
    });
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateCartItem(cartItem.id, quantity).subscribe({
      next: () => {
        console.log('Cart item updated successfully');
        this.loadCart();
      },
      error: (err) => {
        console.error('Failed to update item quantity', err);
        this.error = 'Failed to update item quantity';
      },
    });
  }

  removeItem(cartItemId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeFromCart(cartItemId).subscribe({
        next: () => {
          console.log('Cart item removed successfully');
          this.loadCart();
        },
        error: (err) => {
          console.error('Failed to remove item', err);
          this.error = 'Failed to remove item';
        },
      });
    }
  }

  getTotalPrice(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.router.navigate(['/customer/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/customer/products']);
  }
}