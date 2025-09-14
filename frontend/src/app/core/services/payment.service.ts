import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  initiatePayment(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate`, { phoneNumber });
  }

  checkPaymentStatus(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${orderId}`);
  }

  private getCurrentUserId(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 1;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 1;
  }
}
