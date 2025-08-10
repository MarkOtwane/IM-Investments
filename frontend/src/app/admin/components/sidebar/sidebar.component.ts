import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class AdminSidebarComponent {
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const token = this.authService.getToken();
    if (token) {
      const payload = this.authService['decodeToken'](token);
      this.userEmail = payload ? payload.email : '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }

  getUserInitials(): string {
    if (!this.userEmail) return 'A';
    const parts = this.userEmail.split('@')[0].split('.');
    return parts.map(part => part.charAt(0).toUpperCase()).join('');
  }
}
