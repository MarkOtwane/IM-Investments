import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // User is logged in, redirect to dashboard
      this.router.navigate(['/customer/dashboard']);
      return false;
    }
    
    // User is not logged in, allow access to landing page
    return true;
  }
}
