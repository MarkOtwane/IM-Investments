import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CustomerModule } from '../customer.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CustomerModule, FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  recentlyViewed: Product[] = [];
  productQuantities: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        // Initialize quantities to 1 for each product
        products.forEach((product) => {
          this.productQuantities[product.id] = 1;
        });

        // For demo purposes, use the first few products as recently viewed
        this.recentlyViewed = this.products.slice(0, 4);
      },
      error: (err: any) => console.error('Failed to load products', err),
    });
  }

  addToCart(productId: number, quantity: number): void {
    this.cartService.addToCart(productId.toString(), quantity).subscribe({
      next: () => {
        alert(`Added ${quantity} item(s) to cart!`);
        // Reset quantity to 1 after adding to cart
        this.productQuantities[productId] = 1;
        
        // Update cart in header (if needed)
        // This would require a cart service event or shared state
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        alert('Failed to add item to cart. Please try again.');
      },
    });
  }

  increaseQuantity(productId: number): void {
    this.productQuantities[productId] =
      (this.productQuantities[productId] || 1) + 1;
  }

  decreaseQuantity(productId: number): void {
    if (this.productQuantities[productId] > 1) {
      this.productQuantities[productId] = this.productQuantities[productId] - 1;
    }
  }

  getProductQuantity(productId: number): number {
    return this.productQuantities[productId] || 1;
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/300x300?text=Product+Image';
  }
}
