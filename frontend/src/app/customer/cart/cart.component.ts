import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cart } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CurrencyPipe, FormsModule, ReactiveFormsModule, CommonModule],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => console.error('Failed to load cart', err),
    });
  }

  removeItem(cartItemId: string): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () =>
        this.cartService.getCart().subscribe((cart) => (this.cart = cart)),
      error: (err) => console.error('Failed to remove item', err),
    });
  }
}
