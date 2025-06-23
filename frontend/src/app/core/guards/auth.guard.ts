import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    // Redirect to login page with return URL
    return this.router.createUrlTree(['/customer/login'], {
      queryParams: { returnUrl: this.router.routerState.snapshot.url },
    });
  }
}
