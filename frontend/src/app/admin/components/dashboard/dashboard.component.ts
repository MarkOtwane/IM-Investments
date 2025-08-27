import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, Product } from '../../../core/models/product.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { ProductService } from '../../../core/services/products.service';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalRevenue: number;
}

interface RecentActivity {
  title: string;
  time: string;
  type: 'product' | 'category' | 'order';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  lowStockProducts: Product[] = [];
  recentActivities: RecentActivity[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  loading: boolean = true;
  error: string | null = null;

  // Dashboard stats
  stats: DashboardStats = {
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
  };

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load products
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.lowStockProducts = products.filter((p) => p.stock < 10);
        this.stats.totalProducts = products.length;
        this.stats.lowStockProducts = this.lowStockProducts.length;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products';
      },
    });

    // Load categories
    this.categoriesService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.stats.totalCategories = categories.length;
      },
      error: (err: any) => {
        console.error('Failed to load categories', err);
      },
    });

    // Load analytics summary from backend
    this.http.get<{ totalRevenue: number; totalOrders: number; totalProducts: number; totalCategories: number; lowStockProducts: number }>(`${environment.apiUrl}/analytics/summary`).subscribe({
      next: (summary) => {
        this.stats.totalRevenue = summary.totalRevenue;
        this.stats.totalProducts = summary.totalProducts;
        this.stats.totalCategories = summary.totalCategories;
        this.lowStockProducts = this.products.filter(p => p.stock < 10);
      },
      error: (err) => {
        console.error('Failed to load analytics summary', err);
      }
    });
  }

  get filteredProducts(): Product[] {
    let filtered = this.products;

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.categoryId.toString() === this.selectedCategory
      );
    }

    return filtered;
  }

  get userEmail(): string {
    const token = this.authService.getToken();
    if (!token) return '';
    const payload = this.authService['decodeToken'](token);
    return payload ? payload.email : '';
  }

  get totalRevenue(): number {
    return this.stats.totalRevenue;
  }

  calculateTotalRevenue(products: Product[]): number {
    // This is a mock calculation - in a real app, you'd get this from orders
    return products.reduce(
      (total, product) =>
        total + product.price * Math.floor(Math.random() * 100),
      0
    );
  }

  loadRecentActivities(): void {
    // Mock recent activities - in a real app, this would come from a service
    this.recentActivities = [
      {
        title: 'New product "Premium Headphones" added',
        time: '2 hours ago',
        type: 'product',
      },
      {
        title: 'Category "Electronics" updated',
        time: '4 hours ago',
        type: 'category',
      },
      {
        title: 'Order #12345 completed',
        time: '6 hours ago',
        type: 'order',
      },
      {
        title: 'Product "Wireless Mouse" stock updated',
        time: '1 day ago',
        type: 'product',
      },
    ];
  }

  editProduct(productId: number): void {
    this.router.navigate([`/admin/products/${productId}/edit`]);
  }

  deleteProduct(productId: number): void {
    if (
      confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      this.productService.deleteProduct(productId.toString()).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== productId);
          this.lowStockProducts = this.products.filter((p) => p.stock < 10);
          this.stats.totalProducts = this.products.length;
          this.stats.lowStockProducts = this.lowStockProducts.length;
        },
        error: (err: any) => {
          console.error('Failed to delete product', err);
          alert('Failed to delete product. Please try again.');
        },
      });
    }
  }

  createProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  manageCategories(): void {
    // Navigate to categories management page
    this.router.navigate(['/admin/categories']);
  }

  viewAnalytics(): void {
    // Navigate to analytics page
    this.router.navigate(['/admin/analytics']);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
