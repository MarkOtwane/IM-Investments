import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  recentlyViewed: Product[] = [];
  productQuantities: { [key: number]: number } = {};
  loading = true;
  error: string | null = null;
  showSuccessMessage = false;
  successMessage = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        // Initialize quantities to 1 for each product
        products.forEach((product) => {
          this.productQuantities[product.id] = 1;
        });

        // For demo purposes, use the first few products as recently viewed
        this.recentlyViewed = this.products.slice(0, 4);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      },
    });
  }

  addToCart(productId: number, quantity: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      // Store product info in localStorage for after login
      const pendingCartItem = {
        productId: productId,
        quantity: quantity,
        productName: product.name
      };
      localStorage.setItem('pendingCartItem', JSON.stringify(pendingCartItem));

      // Redirect to login with message
      this.router.navigate(['/customer/login'], {
        queryParams: {
          message: 'Please sign in to add items to your cart',
          returnUrl: '/customer/products'
        }
      });
      return;
    }

    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        this.successMessage = `Added ${quantity} ${
          quantity === 1 ? 'item' : 'items'
        } of ${product.name} to cart!`;

        // Reset quantity to 1 after adding to cart
        this.productQuantities[productId] = 1;

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        this.error = 'Failed to add item to cart. Please try again.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          this.error = null;
        }, 5000);
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
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }

  clearError(): void {
    this.error = null;
  }

  clearSuccessMessage(): void {
    this.showSuccessMessage = false;
    this.successMessage = '';
  }
}
