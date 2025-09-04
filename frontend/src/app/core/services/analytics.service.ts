import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalCustomers: number;
}

export interface SalesData {
  date: string;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.apiUrl}/summary`);
  }

  getSalesByDay(days: number = 30): Observable<SalesData[]> {
    return this.http.get<SalesData[]>(`${this.apiUrl}/sales-by-day?days=${days}`);
  }
}