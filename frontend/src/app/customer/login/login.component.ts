import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

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
        // Check if user is admin and redirect accordingly
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/customer/dashboard']);
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
