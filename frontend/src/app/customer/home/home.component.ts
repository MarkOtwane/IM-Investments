import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CustomerModule } from "../customer.module";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CustomerModule, FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => (this.products = products),
      error: (err: any) => console.error('Failed to load products', err),
    });
  }

  addToCart(productId: string): void {
    this.cartService.addToCart(productId.toString(), 1).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => console.error('Failed to add to cart', err),
    });
  }
}
