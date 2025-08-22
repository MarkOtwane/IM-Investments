import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔍 AuthInterceptor: Processing request to', req.url);
  
  // Skip auth for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('🔍 AuthInterceptor: Skipping auth for authentication endpoint');
    return next(req);
  }
  
  // Get token
  const token = authService.getToken();
  console.log('🔑 AuthInterceptor: Token status:', token ? 'Present' : 'Missing');
  
  if (token) {
    console.log('🔑 AuthInterceptor: Adding token to request headers');
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': req.headers.get('Content-Type') || 'application/json'
      }
    });
    
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ AuthInterceptor: Request failed', {
          url: req.url,
          status: error.status,
          message: error.message,
          error: error.error
        });
        
        if (error.status === 401) {
          console.log('🚪 AuthInterceptor: Unauthorized - token may be invalid or expired');
          
          // Only redirect if this is not an API call (to avoid redirect loops)
          if (!req.url.includes('/api/') && !req.url.includes('/auth/')) {
            console.log('🚪 AuthInterceptor: Redirecting to login page');
            authService.logout();
            router.navigate(['/customer/login'], {
              queryParams: { message: 'Session expired. Please log in again.' }
            });
          }
        }
        
        return throwError(() => error);
      })
    );
  }
  
  console.log('🔑 AuthInterceptor: No token, proceeding without auth header');
  
  // For API endpoints that require auth but no token is present
  if (req.url.includes('/cart') || req.url.includes('/orders') || req.url.includes('/profile')) {
    console.log('⚠️ AuthInterceptor: API endpoint requires authentication but no token found');
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ AuthInterceptor: Unauthenticated request failed', {
        url: req.url,
        status: error.status,
        message: error.message
      });
      return throwError(() => error);
    })
  );
};
