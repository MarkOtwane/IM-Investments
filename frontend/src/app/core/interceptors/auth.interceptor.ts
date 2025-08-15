import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

    console.log('AuthInterceptor: Intercepting request to', req.url);
    
    // Only add JWT to requests targeting the backend API
    if (req.url.startsWith(environment.apiUrl)) {
      console.log('AuthInterceptor: Request targets backend API');
      
      // During server-side rendering, skip adding the token
      if (isPlatformBrowser(platformId)) {
        const token = authService.getToken();
        if (token) {
          console.log('AuthInterceptor: Adding token to request:', token.substring(0, 20) + '...');
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
          return next(authReq).pipe(
            catchError((error: HttpErrorResponse) => handleError(error, authService, router, platformId))
          );
        } else {
          console.log('AuthInterceptor: No token found');
        }
      } else {
        console.log('AuthInterceptor: Running on server, skipping token');
      }
    }
    
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => handleError(error, authService, router, platformId))
    );
};

function handleError(
  error: HttpErrorResponse, 
  authService: AuthService, 
  router: Router, 
  platformId: Object
): Observable<never> {
    console.error('AuthInterceptor: HTTP Error', error);
    
    // Only handle errors on the browser side
    if (!isPlatformBrowser(platformId)) {
      return throwError(() => error);
    }
    
    if (error.status === 401) {
      console.log('AuthInterceptor: Unauthorized, logging out');
      authService.logout();
      router.navigate(['/customer/login'], {
        queryParams: { message: 'Session expired. Please log in again.' },
      });
    } else if (error.status === 403) {
      console.log('AuthInterceptor: Forbidden');
      router.navigate(['/customer']);
    }
    
    return throwError(() => error);
}