import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

interface AuthResponse {
  access_token: string;
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

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.setToken(response.access_token)));
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/password-reset`,
      { email }
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = this.decodeToken(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }

  getUserRole(): 'ADMIN' | 'CUSTOMER' | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = this.decodeToken(token);
    return payload ? payload.role : null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const payload = this.decodeToken(token);
    return payload ? payload.sub : null;
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }
}
