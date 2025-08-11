import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  user: any;
  recentOrders: any[] = [];
  recommendedProducts: any[] = [];
  cartItemsCount: number = 0;
  stats = {
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  };
  
  // Add Math for template usage
  Math = Math;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadDashboardData();
  }

  getCurrentUser(): any {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          name: payload.name || payload.email || 'Customer',
          email: payload.email,
          role: payload.role
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
        items: 3
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'Processing',
        total: 149.50,
        items: 2
      }
    ];

    // Load recommended products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.recommendedProducts = products.slice(0, 4);
      }
    });

    // Mock stats
    this.stats = {
      totalOrders: 12,
      totalSpent: 2847.50,
      loyaltyPoints: 284
    };
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.cartItemsCount++;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
