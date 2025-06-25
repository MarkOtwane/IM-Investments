import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  imports: [FormsModule, CommonModule],
})
export class PasswordResetComponent {
  email: string = '';
  message: string | null = null;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.message = null;
    this.error = null;
    if (this.email) {
      this.authService.requestPasswordReset(this.email).subscribe({
        next: (response) =>
          (this.message =
            response.message || 'Check your email for a reset link'),
        error: (err) =>
          (this.error =
            err.status === 404
              ? 'Email not found'
              : 'Failed to send reset link'),
      });
    } else {
      this.error = 'Please enter a valid email';
    }
  }
}
