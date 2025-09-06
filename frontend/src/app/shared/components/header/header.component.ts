import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../core/models/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;
  cart: Cart | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Only initialize cart on the browser side
    if (isPlatformBrowser(this.platformId) && this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe({
        next: (cart) => (this.cart = cart),
        error: (err) => console.error('Failed to load cart', err),
      });
    }
  }

  get isLoggedIn(): boolean {
    // Don't check auth status during server-side rendering
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.authService.isLoggedIn();
  }

  get userEmail(): string | null {
    // Don't check user data during server-side rendering
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    const token = this.authService.getToken();
    if (!token) return null;
    const payload = this.authService['decodeToken'](token);
    return payload ? payload.email : null;
  }

  get isAdmin(): boolean {
    // Don't check admin status during server-side rendering
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.authService.getUserRole() === 'ADMIN';
  }

  get cartItemCount(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  get isCartPage(): boolean {
    return this.router.url.includes('/customer/cart');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }
}
