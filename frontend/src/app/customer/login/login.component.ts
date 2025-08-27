import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterModule],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        console.log('LoginComponent: Login successful, token stored');

        // Persist email if remember me is enabled
        if (this.rememberMe) {
          localStorage.setItem('savedEmail', this.email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        
        // Check if there's a pending cart item to add
        const pendingCartItemStr = localStorage.getItem('pendingCartItem');
        const pendingCartQueryParam = this.route.snapshot.queryParams['pendingCart'];
        
        if (pendingCartItemStr) {
          try {
            const pendingCartItem = JSON.parse(pendingCartItemStr);
            // Add the pending item to cart
            this.cartService.addToCart(pendingCartItem.productId, pendingCartItem.quantity).subscribe({
              next: () => {
                // Clear the pending cart item
                localStorage.removeItem('pendingCartItem');
                
                // Show success message
                alert(`Added ${pendingCartItem.quantity} ${pendingCartItem.productName} to your cart!`);
                
                // Redirect to products page
                this.router.navigate(['/customer/products']);
              },
              error: (err) => {
                console.error('Failed to add pending item to cart:', err);
                // Still redirect to dashboard even if adding to cart failed
                this.router.navigate(['/customer/dashboard']);
              }
            });
          } catch (e) {
            // If parsing fails, redirect to dashboard
            this.router.navigate(['/customer/dashboard']);
          }
        } else if (pendingCartQueryParam === 'true') {
          // User just registered and has a pending cart item
          // Redirect to products page with a message
          alert('Login successful! Please select an item to add to your cart.');
          this.router.navigate(['/customer/products']);
        } else {
          // Check if user is admin and redirect accordingly
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            // Check for returnUrl in query params
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customer/dashboard';
            this.router.navigate([returnUrl]);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        if (err.status === 401) {
          this.error = 'Invalid email or password. Please try again.';
        } else if (err.status === 0) {
          this.error =
            'Network error. Please check your connection and try again.';
        } else {
          this.error = 'Login failed. Please try again later.';
        }
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.error = null;
  }

  onEmailChange(): void {
    if (this.error) {
      this.clearError();
    }
  }

  onPasswordChange(): void {
    if (this.error) {
      this.clearError();
    }
  }
}
