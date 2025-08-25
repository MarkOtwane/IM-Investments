import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar - Hidden on home page -->
      <aside class="sidebar" [class.sidebar-open]="isSidebarOpen" [class.hidden]="isHomePage">
        <div class="sidebar-header">
          <h2 class="logo">
            <i class="fas fa-chart-line"></i>
            <span>IM Investments</span>
          </h2>
          <button class="sidebar-close" (click)="toggleSidebar()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-title">Main Menu</h3>
            <ul class="nav-list">
              <li>
                <a routerLink="/customer/dashboard" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-tachometer-alt"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/marketplace" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-store"></i>
                  <span>Marketplace</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/cart" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-shopping-cart"></i>
                  <span>My Cart</span>
                  <span class="badge" *ngIf="cartItemsCount > 0">{{ cartItemsCount }}</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/orders" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-history"></i>
                  <span>Orders</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/order-history" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-list"></i>
                  <span>Order History</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/wishlist" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-heart"></i>
                  <span>Wishlist</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div class="nav-section">
            <h3 class="nav-title">Account</h3>
            <ul class="nav-list">
              <li>
                <a routerLink="/customer/profile" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-user"></i>
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/profile/settings" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-cog"></i>
                  <span>Profile Settings</span>
                </a>
              </li>
              <li>
                <a routerLink="/customer/support" routerLinkActive="active" class="nav-item">
                  <i class="fas fa-headset"></i>
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <div class="main-wrapper" [class.full-width]="isHomePage">
        <!-- Topbar -->
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <i class="fas fa-bars"></i>
            </button>
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Search...">
            </div>
          </div>
          
          <div class="topbar-right">
            <button class="icon-btn">
              <i class="fas fa-bell"></i>
              <span class="notification-badge">3</span>
            </button>
            <button class="icon-btn">
              <i class="fas fa-cog"></i>
            </button>
            <div class="user-profile" (click)="toggleUserMenu()">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
        </header>
        
        <!-- User Menu Dropdown -->
        <div class="user-menu-dropdown" *ngIf="showUserMenu" (clickOutside)="showUserMenu = false">
          <div class="user-menu-header">
            <div class="user-avatar-large">
              <i class="fas fa-user"></i>
            </div>
            <div class="user-info">
              <h4>{{ userName }}</h4>
              <p>{{ userEmail }}</p>
            </div>
          </div>
          <div class="user-menu-items">
            <a routerLink="/customer/profile" class="user-menu-item">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </a>
            <a routerLink="/customer/profile/settings" class="user-menu-item">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </a>
            <a routerLink="/customer/support" class="user-menu-item">
              <i class="fas fa-headset"></i>
              <span>Support</span>
            </a>
            <hr>
            <button class="user-menu-item" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        <!-- Page Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class CustomerDashboardLayoutComponent implements OnInit {
  isSidebarOpen = false;
  showUserMenu = false;
  cartItemsCount = 0;
  user: any;
  showNotifications = false;
  isHomePage = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.getCurrentUser();
    this.loadCartItemsCount();
    
    // Subscribe to route changes to detect if we're on the home page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = this.isCurrentRouteHome(event.urlAfterRedirects);
      console.log('Current Route:', event.urlAfterRedirects, 'Is Home Page:', this.isHomePage);
    });

    // Check initial route
    this.isHomePage = this.isCurrentRouteHome(this.router.url);
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
          name: payload.name || payload.email || 'Customer',
          email: payload.email,
          role: payload.role,
        };
      } catch (e) {
        return { name: 'Customer' };
      }
    }
    return { name: 'Customer' };
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  loadCartItemsCount(): void {
    // In a real implementation, this would fetch from the cart service
    this.cartItemsCount = 3; // Mock value
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }

  private isCurrentRouteHome(url: string): boolean {
    // Check if the current route is the home page
    console.log('Checking URL:', url);
    const isHome = url === '/customer/home' || url === '/customer/home/' || url === '/customer';
    console.log('Is Home Page:', isHome);
    return isHome;
  }
}