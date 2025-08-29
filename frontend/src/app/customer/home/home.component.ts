import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Category, Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { NotificationService } from '../../core/services/notification.service';
import { CategoriesService } from '../../core/services/categories.service';

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

  // Filtering/search state
  categories: Category[] = [];
  selectedCategoryId: number | 'all' = 'all';
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Success notification properties
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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
        this.notificationService.showError('Failed to load products. Please try again later.');
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err: any) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  get filteredProducts(): Product[] {
    let filtered = [...this.products];

    if (this.selectedCategoryId !== 'all') {
      filtered = filtered.filter(p => p.categoryId === this.selectedCategoryId);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.category?.name || '').toLowerCase().includes(term)
      );
    }

    if (this.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= (this.minPrice as number));
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= (this.maxPrice as number));
    }

    return filtered;
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
      if (isPlatformBrowser(this.authService['platformId'] as any)) {
        localStorage.setItem('pendingCartItem', JSON.stringify(pendingCartItem));
      }

      // Redirect to login with message
      this.router.navigate(['/customer/login'], {
        queryParams: {
          message: 'Please sign in to add items to your cart',
          returnUrl: '/customer/products'
        }
      });
      return;
    }

    console.log('HomeComponent: Adding to cart - User is logged in');
    console.log('HomeComponent: Token exists:', !!this.authService.getToken());
    
    this.cartService.addToCart(productId, quantity).subscribe({
      next: (cartItem) => {
        console.log('Successfully added to cart', cartItem);
        this.notificationService.showSuccess(`Added ${quantity} ${
          quantity === 1 ? 'item' : 'items'
        } of ${product.name} to cart!`);

        // Reset quantity to 1 after adding to cart
        this.productQuantities[productId] = 1;
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        if (err.status === 401) {
          this.error = 'Please log in again to add items to cart.';
          this.notificationService.showError('Please log in again to add items to cart.');
          this.authService.logout();
          this.router.navigate(['/customer/login']);
        } else {
          this.error = 'Failed to add item to cart. Please try again.';
          this.notificationService.showError('Failed to add item to cart. Please try again.');
        }
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
    event.target.src = 'https://placehold.co/300x200?text=No+Image';
  }

  clearError(): void {
    this.error = null;
  }

  // Success notification method
  clearSuccessMessage(): void {
    this.showSuccessMessage = false;
    this.successMessage = '';
  }
}
