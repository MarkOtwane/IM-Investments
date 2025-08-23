import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/products.service';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class CustomerDashboardComponent implements OnInit {
  user: any;
  recentOrders: any[] = [];
  recommendedProducts: any[] = [];
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
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadDashboardData();
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
    // Load recent orders (mock data)
    this.recentOrders = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'Delivered',
        total: 299.99,
        items: 3,
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'Processing',
        total: 149.5,
        items: 2,
      },
    ];

    // Load recommended products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.recommendedProducts = products.slice(0, 4);
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

    // Mock stats
    this.stats = {
      totalOrders: 12,
      totalSpent: 2847.5,
      loyaltyPoints: 284,
    };
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
