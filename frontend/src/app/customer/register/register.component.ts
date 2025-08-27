import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptTerms: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private cartService: CartService
  ) {}

  onSubmit(): void {
    this.error = null;

    // Validation
    if (!this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all required fields';
      return;
    }

    if (!this.acceptTerms) {
      this.error = 'Please accept the terms and conditions';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.loading = true;

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;

        // Check if there's a pending cart item to add
        const pendingCartItemStr = localStorage.getItem('pendingCartItem');
        if (pendingCartItemStr) {
          // Redirect to login with a special message
          this.router.navigate(['/customer/login'], {
            queryParams: {
              message:
                'Account created successfully! Please sign in to add your item to cart.',
              pendingCart: 'true',
            },
          });
        } else {
          // Show success message and redirect to login
          this.router.navigate(['/customer/login'], {
            queryParams: {
              message: 'Account created successfully! Please sign in.',
            },
          });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration failed:', err);
        if (err.status === 400) {
          this.error = 'Email already exists. Please try a different email.';
        } else if (err.status === 0) {
          this.error =
            'Network error. Please check your connection and try again.';
        } else {
          this.error = 'Registration failed. Please try again later.';
        }
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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

  onConfirmPasswordChange(): void {
    if (this.error) {
      this.clearError();
    }
  }
}
