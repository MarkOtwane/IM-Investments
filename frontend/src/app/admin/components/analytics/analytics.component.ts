import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';
import { AnalyticsService, AnalyticsSummary, SalesData } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-admin-sidebar></app-admin-sidebar>

      <div class="flex-1 ml-64">
        <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p class="text-gray-600 text-sm">Track your business performance and insights</p>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading analytics data...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error loading analytics</h3>
                <div class="mt-2 text-sm text-red-700">{{ error }}</div>
              </div>
            </div>
          </div>

          <!-- Key Metrics -->
          <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p class="text-3xl font-bold text-gray-900">{{ analytics?.totalRevenue?.toLocaleString() || '0' }}</p>
                </div>
                <div class="bg-green-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-sm text-gray-500">Total earnings from all orders</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Orders</p>
                  <p class="text-3xl font-bold text-gray-900">{{ analytics?.totalOrders || 0 }}</p>
                </div>
                <div class="bg-blue-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-sm text-gray-500">Number of completed orders</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Products</p>
                  <p class="text-3xl font-bold text-gray-900">{{ analytics?.totalProducts || 0 }}</p>
                </div>
                <div class="bg-purple-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-sm text-gray-500">Products in your catalog</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p class="text-3xl font-bold text-gray-900">{{ analytics?.lowStockProducts || 0 }}</p>
                </div>
                <div class="bg-yellow-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-sm text-gray-500">Products with stock < 10</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Customers</p>
                  <p class="text-3xl font-bold text-gray-900">{{ analytics?.totalCustomers || 0 }}</p>
                </div>
                <div class="bg-purple-100 p-3 rounded-lg">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <span class="text-sm text-gray-500">Registered customer accounts</span>
              </div>
            </div>
          </div>

          <!-- Charts -->
          <div *ngIf="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sales Overview (Last 30 Days)</h3>
              <div *ngIf="salesData.length === 0" class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p class="text-gray-500">No sales data available</p>
              </div>
              <div *ngIf="salesData.length > 0" class="h-64">
                <div class="space-y-2">
                  <div *ngFor="let data of salesData.slice(-7)" class="flex items-center justify-between py-1">
                    <span class="text-sm text-gray-600">{{ formatDate(data.date) }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ data.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Categories</span>
                  <span class="text-sm font-medium text-gray-900">{{ analytics?.totalCategories || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Avg Order Value</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ analytics ? (analytics.totalOrders ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00') : '0.00' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Stock Health</span>
                  <span class="text-sm font-medium" [class]="analytics ? (analytics.lowStockProducts > 0 ? 'text-yellow-600' : 'text-green-600') : 'text-green-600'">
                    {{ analytics ? (analytics.lowStockProducts > 0 ? 'Needs Attention' : 'Good') : 'Good' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminAnalyticsComponent implements OnInit {
  analytics: AnalyticsSummary | null = null;
  salesData: SalesData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    // Load summary data
    this.analyticsService.getSummary().subscribe({
      next: (summary) => {
        this.analytics = summary;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics summary', err);
        this.error = 'Failed to load analytics data. Please try again.';
        this.loading = false;
      }
    });

    // Load sales data
    this.analyticsService.getSalesByDay(30).subscribe({
      next: (data) => {
        this.salesData = data;
      },
      error: (err) => {
        console.error('Failed to load sales data', err);
        // Don't set error for sales data, just log it
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}