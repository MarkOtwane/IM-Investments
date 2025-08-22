import { Component, OnInit, HostListener } from '@angular/core';
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
    <div class="min-h-screen bg-gray-50">
      <!-- Mobile Overlay -->
      <div *ngIf="isMobile && sidebarOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 z-40"
           (click)="closeSidebar()"></div>

      <!-- Sidebar -->
      <aside class="fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out"
             [class.translate-x-0]="!isMobile || sidebarOpen"
             [class.-translate-x-full]="isMobile && !sidebarOpen">
        
        <!-- Logo Section -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="ml-3">
              <h2 class="text-lg font-bold text-gray-900">IM Investment</h2>
              <p class="text-xs text-gray-500">Customer Portal</p>
            </div>
          </div>
          <button *ngIf="isMobile" 
                  (click)="closeSidebar()"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <!-- Shopping Section -->
          <div class="mb-8">
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shopping</h3>
            <div class="space-y-1">
              <a routerLink="/customer/dashboard" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                  </svg>
                </div>
                Dashboard
              </a>
              
              <a routerLink="/customer/marketplace" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                Marketplace
              </a>
              
              <a routerLink="/customer/cart" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                  </svg>
                </div>
                My Cart
                <span *ngIf="cartItemsCount > 0" 
                      class="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {{ cartItemsCount }}
                </span>
              </a>
            </div>
          </div>

          <!-- Orders Section -->
          <div class="mb-8">
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Orders</h3>
            <div class="space-y-1">
              <a routerLink="/customer/orders" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9z"/>
                  </svg>
                </div>
                Current Orders
              </a>
              
              <a routerLink="/customer/order-history" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                Order History
              </a>
              
              <a routerLink="/customer/wishlist" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-pink-200 transition-colors">
                  <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                Wishlist
              </a>
            </div>
          </div>

          <!-- Account Section -->
          <div class="mb-8">
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
            <div class="space-y-1">
              <a routerLink="/customer/profile" 
                 routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-teal-200 transition-colors">
                  <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                Profile
              </a>
            </div>
          </div>

          <!-- Support Section -->
          <div>
            <h3 class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Support</h3>
            <div class="space-y-1">
              <a href="mailto:support@iminvestment.com" 
                 class="flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 group">
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                Help & Support
              </a>
            </div>
          </div>
        </nav>

        <!-- User Profile Section -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-sm">{{ getUserInitials() }}</span>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
            </div>
          </div>
          
          <button (click)="logout()" 
                  class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="transition-all duration-300 ease-in-out" [class.ml-72]="!isMobile">
        <!-- Top Header -->
        <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <button *ngIf="isMobile" 
                        (click)="toggleSidebar()"
                        class="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
                  <p class="text-sm text-gray-500">{{ getPageSubtitle() }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <!-- Search -->
                <div class="hidden md:block relative">
                  <input type="text" 
                         placeholder="Search products..." 
                         class="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                
                <!-- Notifications -->
                <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l-.9.9a2 2 0 000 2.83L10.9 8.28a2 2 0 002.83 0l.9-.9a2 2 0 000-2.83L12.9 2.82a2 2 0 00-2.83 0z"/>
                  </svg>
                  <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <!-- Quick Cart Access -->
                <a routerLink="/customer/cart" 
                   class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
                  </svg>
                  <span *ngIf="cartItemsCount > 0" 
                        class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {{ cartItemsCount }}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
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
export class CustomerLayoutComponent implements OnInit {
  sidebarOpen = false;
  isMobile = false;
  cartItemsCount = 0;
  currentRoute = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    // Check screen size
    this.checkScreenSize();
    
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Close sidebar on mobile after navigation
      if (this.isMobile) {
        this.sidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadCartCount();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.sidebarOpen = false;
      }
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
        error: (err) => {
          console.error('Failed to load cart count', err);
          // If we get a 401 error, the token might be invalid
          if (err.status === 401) {
            console.log('Authentication failed, logging out user');
            this.authService.logout();
            this.cartItemsCount = 0;
          }
        }
      });
    } else {
      this.cartItemsCount = 0;
    }
  }

  getPageTitle(): string {
    const routeTitles: { [key: string]: string } = {
      '/customer/home': 'Home',
      '/customer/dashboard': 'Dashboard',
      '/customer/marketplace': 'Marketplace',
      '/customer/cart': 'Shopping Cart',
      '/customer/orders': 'My Orders',
      '/customer/order-history': 'Order History',
      '/customer/wishlist': 'Wishlist',
      '/customer/profile': 'Profile Settings',
      '/customer/checkout': 'Checkout',
      '/customer/products': 'Products'
    };
    
    return routeTitles[this.currentRoute] || 'Customer Portal';
  }

  getPageSubtitle(): string {
    const routeSubtitles: { [key: string]: string } = {
      '/customer/home': 'Welcome to IM Investments',
      '/customer/dashboard': 'Welcome to your personal dashboard',
      '/customer/marketplace': 'Discover amazing products',
      '/customer/cart': 'Review your selected items',
      '/customer/orders': 'Track your current orders',
      '/customer/order-history': 'View your past purchases',
      '/customer/wishlist': 'Your saved items',
      '/customer/profile': 'Manage your account information',
      '/customer/checkout': 'Complete your purchase',
      '/customer/products': 'Browse our product catalog'
    };
    
    return routeSubtitles[this.currentRoute] || 'Manage your shopping experience';
  }

  get userName(): string {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService.decodeToken(token);
      return payload?.email?.split('@')[0] || 'Customer';
    }
    return 'Customer';
  }

  get userEmail(): string {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService.decodeToken(token);
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