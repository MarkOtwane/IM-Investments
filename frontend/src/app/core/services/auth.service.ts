import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { User } from '../models/user.model';

interface AuthResponse {
  access_token: string;
}

interface PasswordResetResponse {
  message: string;
}

interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('AuthService: Logging in user', email);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('AuthService: Login successful', response);
          console.log('AuthService: Token received (first 30 chars):', response.access_token.substring(0, 30) + '...');
          this.setToken(response.access_token);
          
          // Verify token was stored
          const storedToken = this.getToken();
          console.log('AuthService: Token verification after storage:', storedToken ? 'Success' : 'Failed');
        })
      );
  }

  register(email: string, password: string): Observable<AuthResponse> {
    console.log('AuthService: Registering user', email);
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        tap((response) => {
          console.log('AuthService: Registration successful', response);
          this.setToken(response.access_token);
        })
      );
  }

  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(
      `${this.apiUrl}/password-reset`,
      { email }
    );
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    
    const token = this.getToken();
    if (!token) return false;
    
    const isExpired = this.isTokenExpired(token);
    console.log('AuthService: Token expired?', isExpired);
    return !isExpired;
  }

  getUserRole(): 'ADMIN' | 'CUSTOMER' | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.decodeToken(token);
    return payload ? payload.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      console.log('AuthService: User logged out');
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('AuthService: Getting token from localStorage:', token ? `Token exists (${token.length} chars)` : 'No token');
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      console.log('AuthService: Token stored in localStorage, length:', token.length);
    }
  }

  public decodeToken(token: string): JwtPayload | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      console.log('AuthService: Decoded token payload', {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat
      });
      return payload;
    } catch (e) {
      console.error('AuthService: Failed to decode token', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}