import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-customer-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-marketplace.component.html',
  styleUrls: ['./customer-marketplace.component.css']
})
export class CustomerMarketplaceComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = '';
  categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports'];
  productQuantities: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Initialize quantities to 1 for each product
        products.forEach((product) => {
          this.productQuantities[product.id] = 1;
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    // For now, we'll just reload all products
    // In a real implementation, this would filter the products array
    this.loadProducts();
  }

  goBackToDashboard(): void {
    window.history.back();
  }

  addToCart(productId: number, quantity: number = 1): void {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: (cartItem) => {
        console.log('Added to cart:', cartItem);
        // Show success message to user
        alert(`Added ${quantity} item(s) to cart!`);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // Show error message to user
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }

  getProductQuantity(productId: number): number {
    return this.productQuantities[productId] || 1;
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }
}
