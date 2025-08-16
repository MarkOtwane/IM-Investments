import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold text-blue-600">
              IM Investments
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <!-- <a routerLink="/customer/home" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </a> -->
            <a routerLink="/customer/marketplace" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Marketplace
            </a>
            <a routerLink="/customer/cart" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              My Cart
            </a>
            <a routerLink="/customer/orders" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Orders
            </a>
            <a routerLink="/customer/order-history" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Order History
            </a>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <a routerLink="/customer/cart" class="relative text-gray-600 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </a>
            
            <div class="relative">
              <button (click)="toggleUserMenu()" class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>
              
              <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a routerLink="/customer/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a routerLink="/customer/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </a>
                <hr class="my-1">
                <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class CustomerHeaderComponent {
  showUserMenu = false;

  constructor(private authService: AuthService) {}

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
