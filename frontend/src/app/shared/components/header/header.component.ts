import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe({
        next: (cart) => (this.cart = cart),
        error: (err) => console.error('Failed to load cart', err),
      });
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userEmail(): string | null {
    const token = this.authService.getToken();
    if (!token) return null;
    const payload = this.authService['decodeToken'](token);
    return payload ? payload.email : null;
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMIN';
  }

  get cartItemCount(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }
}
