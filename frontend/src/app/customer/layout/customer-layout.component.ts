import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-30" 
             [class.translate-x-0]="!isMobile || sidebarOpen"
             [class.-translate-x-full]="isMobile && !sidebarOpen">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">IM Investment</h2>
              <p class="text-xs text-gray-500">Customer Portal</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <div class="mb-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shopping</p>
            <a routerLink="/customer/dashboard" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
              </svg>
              Dashboard
            </a>
            
            <a routerLink="/customer/marketplace" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Marketplace
            </a>
            
            <a routerLink="/customer/cart" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
              </svg>
              My Cart
              <span *ngIf="cartItemsCount > 0" class="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {{ cartItemsCount }}
              </span>
            </a>
          </div>

          <div class="mb-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Orders</p>
            <a routerLink="/customer/orders" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
              </svg>
              Current Orders
            </a>
            
            <a routerLink="/customer/order-history" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Order History
            </a>
            
            <a routerLink="/customer/wishlist" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Wishlist
            </a>
          </div>

          <div class="mb-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</p>
            <a routerLink="/customer/profile" 
               routerLinkActive="bg-blue-50 text-blue-700 border-r-2 border-blue-600"
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Profile
            </a>
          </div>

          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Support</p>
            <a href="mailto:support@iminvestment.com" 
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Help & Support
            </a>
          </div>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
              <span class="text-white font-semibold text-sm">{{ getUserInitials() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
            </div>
          </div>
          
          <button (click)="logout()" 
                  class="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div *ngIf="isMobile && sidebarOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 z-20"
           (click)="closeSidebar()"></div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col" [class.ml-64]="!isMobile">
        <!-- Top Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <button *ngIf="isMobile" 
                      (click)="toggleSidebar()"
                      class="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <h1 class="text-xl font-semibold text-gray-900">{{ getPageTitle() }}</h1>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="hidden md:block relative">
                <input type="text" 
                       placeholder="Search products..." 
                       class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l-.9.9a2 2 0 000 2.83L10.9 8.28a2 2 0 002.83 0l.9-.9a2 2 0 000-2.83L12.9 2.82a2 2 0 00-2.83 0z"/>
                </svg>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Quick Cart Access -->
              <a routerLink="/customer/cart" 
                 class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                </svg>
                <span *ngIf="cartItemsCount > 0" 
                      class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ cartItemsCount }}
                </span>
              </a>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-transition {
      transition: transform 0.3s ease-in-out;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class CustomerLayoutComponent {
  sidebarOpen = false;
  isMobile = false;
  cartItemsCount = 0;
  currentRoute = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
    
    // Load cart count
    this.loadCartCount();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  loadCartCount(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe({
        next: (cart) => {
          this.cartItemsCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
        },
        error: (err) => console.error('Failed to load cart count', err)
      });
    }
  }

  getPageTitle(): string {
    const routeTitles: { [key: string]: string } = {
      '/customer/dashboard': 'Dashboard',
      '/customer/marketplace': 'Marketplace',
      '/customer/cart': 'Shopping Cart',
      '/customer/orders': 'My Orders',
      '/customer/order-history': 'Order History',
      '/customer/wishlist': 'Wishlist',
      '/customer/profile': 'Profile Settings',
      '/customer/checkout': 'Checkout'
    };
    
    return routeTitles[this.currentRoute] || 'Customer Portal';
  }

  get userName(): string {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService['decodeToken'](token);
      return payload?.email?.split('@')[0] || 'Customer';
    }
    return 'Customer';
  }

  get userEmail(): string {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService['decodeToken'](token);
      return payload?.email || '';
    }
    return '';
  }

  getUserInitials(): string {
    const name = this.userName;
    return name.charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }
}