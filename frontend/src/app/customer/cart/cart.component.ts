import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
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

  removeItem(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () =>
        this.cartService.getCart().subscribe((cart) => (this.cart = cart)),
      error: (err) => console.error('Failed to remove item', err),
    });
  }
}
