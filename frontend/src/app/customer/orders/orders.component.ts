import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
          <button
            routerLink="/customer/marketplace"
            class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Continue Shopping
          </button>
        </div>

        <div *ngIf="loading" class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <span class="ml-3 text-gray-600">Loading orders...</span>
        </div>

        <div *ngIf="!loading && orders.length > 0" class="space-y-6">
          <div
            *ngFor="let order of orders"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Order {{ order.id }}
                </h3>
                <p class="text-sm text-gray-500">Placed on {{ order.date }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                [class]="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                {{ order.items }} items • Total:
                <span class="font-semibold">\${{ order.total }}</span>
              </div>
              <div class="flex space-x-3">
                <button
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  *ngIf="order.status === 'Delivered'"
                  class="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && orders.length === 0" class="text-center py-16">
          <div
            class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p class="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
          <button
            routerLink="/customer/home"
            class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.orders = [
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
      this.loading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
}
