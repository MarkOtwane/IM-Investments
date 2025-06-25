import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const returnUrl =
          this.router.parseUrl(this.router.url).queryParams['returnUrl'] ||
          '/customer';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => (this.error = 'Invalid email or password'),
    });
  }
}
