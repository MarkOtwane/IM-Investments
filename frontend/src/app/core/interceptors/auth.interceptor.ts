import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Intercepting request', req.url);
    // Only add JWT to requests targeting the backend API
    if (req.url.startsWith(environment.apiUrl)) {
      console.log('AuthInterceptor: Request targets backend API');
      // During server-side rendering, we can't access localStorage
      // So we skip adding the token on the server
      if (isPlatformBrowser(this.platformId)) {
        const token = this.authService.getToken();
        if (token) {
          console.log('AuthInterceptor: Token found', token);
          // Clone request and add Authorization header
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
          console.log('AuthInterceptor: Sending authenticated request', authReq);
          return next
            .handle(authReq)
            .pipe(
              catchError((error: HttpErrorResponse) => this.handleError(error))
            );
        } else {
          console.log('AuthInterceptor: No token found');
        }
      } else {
        console.log('AuthInterceptor: Running on server, skipping token');
      }
    } else {
      console.log('AuthInterceptor: Request does not target backend API');
    }
    // Pass through requests without modification if no token or not API URL
    console.log('AuthInterceptor: Sending unauthenticated request', req);
    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Only handle errors on the browser side
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => error);
    }
    
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
