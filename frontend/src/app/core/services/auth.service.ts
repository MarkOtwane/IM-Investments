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

interface JwtPayload extends User {
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
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(
      `${this.apiUrl}/password-reset`,
      { email }
    );
  }

  isLoggedIn(): boolean {
    // Don't check token during server-side rendering
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    
    const token = this.getToken();
    console.log('AuthService: Checking if user is logged in', token);
    if (!token) return false;
    const isExpired = this.isTokenExpired(token);
    console.log('AuthService: Token is expired', isExpired);
    return !isExpired;
  }

  getUserRole(): 'ADMIN' | 'CUSTOMER' | null {
    // Don't check token during server-side rendering
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
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('AuthService: Getting token from localStorage', token);
      return token;
    }
    console.log('AuthService: Not in browser environment');
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      console.log('AuthService: Decoding token', token);
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      console.log('AuthService: Decoded token payload', payload);
      return payload;
    } catch (e) {
      console.error('AuthService: Failed to decode token', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    console.log('AuthService: Decoded token payload', payload);
    if (!payload) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('AuthService: Current time', currentTime, 'Token expiration', payload.exp);
    const isExpired = payload.exp < currentTime;
    console.log('AuthService: Token is expired', isExpired);
    return isExpired;
  }
}
