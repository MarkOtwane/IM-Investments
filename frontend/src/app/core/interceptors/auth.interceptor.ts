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
    console.log('AuthInterceptor: Intercepting request to', req.url);
    
    // Only add JWT to requests targeting the backend API
    if (req.url.startsWith(environment.apiUrl)) {
      console.log('AuthInterceptor: Request targets backend API');
      
      // During server-side rendering, skip adding the token
      if (isPlatformBrowser(this.platformId)) {
        const token = this.authService.getToken();
        if (token) {
          console.log('AuthInterceptor: Adding token to request');
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
          return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
          );
        } else {
          console.log('AuthInterceptor: No token found');
        }
      } else {
        console.log('AuthInterceptor: Running on server, skipping token');
      }
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthInterceptor: HTTP Error', error);
    
    // Only handle errors on the browser side
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => error);
    }
    
    if (error.status === 401) {
      console.log('AuthInterceptor: Unauthorized, logging out');
      this.authService.logout();
      this.router.navigate(['/customer/login'], {
        queryParams: { message: 'Session expired. Please log in again.' },
      });
    } else if (error.status === 403) {
      console.log('AuthInterceptor: Forbidden');
      this.router.navigate(['/customer']);
    }
    
    return throwError(() => error);
  }
}