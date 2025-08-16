import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';

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
            <div class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p class="mt-1 text-sm text-gray-500">Orders will appear here when customers make purchases.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  ngOnInit(): void {
    // Load orders logic here
  }
}