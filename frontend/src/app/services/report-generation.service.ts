import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Brand, Category, Product, ReportFilters, ReportItem } from '../models/report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {
  private baseUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<{ success: boolean; data: Brand[] }>(
      `${this.baseUrl}/brands`, 
      this.getHeaders()
    ).pipe(map(res => res.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<{ success: boolean; data: Category[] }>(
      `${this.baseUrl}/categories`, 
      this.getHeaders()
    ).pipe(map(res => res.data));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ success: boolean; data: Product[] }>(
      `${this.baseUrl}/products`, 
      this.getHeaders()
    ).pipe(map(res => res.data));
  }

  generateReport(filters: ReportFilters): Observable<ReportItem[]> {
    return this.http.post<{ success: boolean; data: ReportItem[] }>(
      `${this.baseUrl}/generate`, 
      filters, 
      this.getHeaders()
    ).pipe(map(res => res.data));
  }
}
