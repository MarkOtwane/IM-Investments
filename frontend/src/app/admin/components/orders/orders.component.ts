import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-admin-sidebar></app-admin-sidebar>
      
      <div class="flex-1 ml-64">
        <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p class="text-gray-600 text-sm">Manage customer orders and track their status</p>
        </div>
        
        <div class="p-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>

            <div *ngIf="loading" class="flex items-center text-gray-600">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Loading orders...
            </div>

            <div *ngIf="!loading && orders.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p class="mt-1 text-sm text-gray-500">Orders will appear here when customers make purchases.</p>
            </div>

            <div *ngIf="!loading && orders.length > 0" class="space-y-4">
              <div *ngFor="let order of orders" class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="text-gray-900 font-semibold">Order #{{ order.id }}</div>
                    <div class="text-sm text-gray-500">Placed {{ order.createdAt | date:'medium' }} • {{ order.userEmail }}</div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 rounded-full text-sm font-medium" [class]="statusClass(order.status)">{{ order.status }}</span>
                    <select class="border rounded px-2 py-1 text-sm" [ngModel]="order.status" (ngModelChange)="updateStatus(order, $event)">
                      <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
                <div class="mt-3 text-sm text-gray-700">Items: {{ order.items.reduce((s: number, it: any) => s + it.quantity, 0) }} • Total: ${{ order.totalAmount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = false;
  statuses: Array<'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'> = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/orders/admin/all`).subscribe({
      next: (res) => {
        this.orders = res.map(o => ({
          ...o,
          userEmail: o.user?.email ?? 'Unknown',
        }));
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      }
    });
  }

  updateStatus(order: any, newStatus: string): void {
    if (newStatus === order.status) return;
    const previous = order.status;
    order.status = newStatus;
    this.http.patch(`${environment.apiUrl}/orders/${order.id}/status`, { status: newStatus }).subscribe({
      next: () => {},
      error: () => {
        order.status = previous;
      }
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }
}