import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only add JWT to requests targeting the backend API
    if (req.url.startsWith(environment.apiUrl)) {
      const token = this.authService.getToken();
      if (token) {
        // Clone request and add Authorization header
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next
          .handle(authReq)
          .pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
          );
      }
    }
    // Pass through requests without modification if no token or not API URL
    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Unauthorized: Clear token and redirect to login
      this.authService.logout();
      this.router.navigate(['/customer/login'], {
        queryParams: { returnUrl: this.router.routerState.snapshot.url },
      });
      return throwError(
        () => new Error('Session expired. Please log in again.')
      );
    } else if (error.status === 403) {
      // Forbidden: Notify user of insufficient permissions
      this.router.navigate(['/customer']);
      return throwError(
        () => new Error('You do not have permission to perform this action.')
      );
    }
    // Rethrow other errors
    return throwError(() => error);
  }
}
