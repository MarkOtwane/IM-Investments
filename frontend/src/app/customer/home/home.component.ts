import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CustomerModule } from "../customer.module";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CustomerModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Failed to load products', err),
    });
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => console.error('Failed to add to cart', err),
    });
  }
}
