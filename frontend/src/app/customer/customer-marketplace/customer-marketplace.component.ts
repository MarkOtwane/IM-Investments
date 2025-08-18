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
        const product = this.products.find(p => p.id === productId);
        // Show success notification
        this.showSuccessNotification(`Added ${quantity} ${product?.name || 'item(s)'} to cart!`);
        // Reset quantity after adding
        this.productQuantities[productId] = 1;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        if (error.status === 401) {
          this.showErrorNotification('Please log in to add items to cart.');
        } else {
          this.showErrorNotification('Failed to add item to cart. Please try again.');
        }
      }
    });
  }

  increaseQuantity(productId: number): void {
    this.productQuantities[productId] = (this.productQuantities[productId] || 1) + 1;
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
    event.target.src = 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
  }

  private showSuccessNotification(message: string): void {
    // Create and show a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  private showErrorNotification(message: string): void {
    // Create and show a temporary error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}
