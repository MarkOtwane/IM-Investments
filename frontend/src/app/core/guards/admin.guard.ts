import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (
      this.authService.isLoggedIn() &&
      this.authService.getUserRole() === 'ADMIN'
    ) {
      return true;
    }
    // Redirect to home page if not admin
    return this.router.createUrlTree(['/customer']);
  }
}
