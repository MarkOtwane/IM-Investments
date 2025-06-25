import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }
}
