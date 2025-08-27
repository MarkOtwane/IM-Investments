import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { OrdersService } from '../../core/services/orders.service';
import { Category } from '../../core/models/product.model';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class CustomerDashboardComponent implements OnInit {
  user: any;
  recentOrders: any[] = [];
  recommendedProducts: any[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | 'all' = 'all';
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  cartItemsCount: number = 0;
  stats = {
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  };

  // Toast notification properties
  hideSuccessToast: boolean = true;
  showSuccessMessage: string = '';
  showErrorToast: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadDashboardData();
    this.loadCategories();
  }

  get userName(): string {
    return this.user?.name || 'Customer';
  }

  get userEmail(): string {
    return this.user?.email || '';
  }

  getCurrentUser(): any {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          name: payload.name || payload.email?.split('@')[0] || 'Customer',
          email: payload.email,
          role: payload.role,
        };
      } catch (e) {
        return { name: 'Customer' };
      }
    }
    return { name: 'Customer' };
  }

  loadDashboardData(): void {
    // Load recent orders (real data)
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5).map(o => ({
          id: `ORD-${o.id}`,
          date: new Date(o.createdAt).toISOString().slice(0,10),
          status: o.status,
          total: o.totalAmount,
          items: o.items?.reduce((t, it) => t + it.quantity, 0) || 0,
        }));
        this.stats.totalOrders = orders.length;
        this.stats.totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        this.stats.loyaltyPoints = Math.floor(this.stats.totalSpent / 10);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      }
    });

    // Load recommended products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.recommendedProducts = products;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.notificationService.showError('Failed to load recommended products.');
      }
    });

    // Load cart count
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItemsCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.notificationService.showError('Failed to load cart information.');
      }
    });

    // Stats now computed from real orders above
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: () => {}
    });
  }

  get filteredRecommended(): any[] {
    let filtered = [...this.recommendedProducts];
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
    if (this.minPrice !== null) filtered = filtered.filter(p => p.price >= (this.minPrice as number));
    if (this.maxPrice !== null) filtered = filtered.filter(p => p.price <= (this.maxPrice as number));
    return filtered.slice(0, 8);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.cartItemsCount++;
        this.notificationService.showSuccess(`Added ${product.name} to cart!`);
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        this.notificationService.showError('Failed to add item to cart. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Delivered': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'Delivered': 'fas fa-check-circle',
      'Processing': 'fas fa-sync-alt',
      'Shipped': 'fas fa-truck',
      'Cancelled': 'fas fa-times-circle',
      'Pending': 'fas fa-clock'
    };
    return statusIcons[status] || 'fas fa-question-circle';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }

  // Toast notification methods
  closeSuccessToast(): void {
    this.hideSuccessToast = true;
    this.showSuccessMessage = '';
  }

  closeErrorToast(): void {
    this.showErrorToast = false;
    this.errorMessage = '';
  }
}
