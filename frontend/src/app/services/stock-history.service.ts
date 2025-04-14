import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockHistoryService {
  private apiUrl = 'http://localhost:5000/api/stock-history';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error loading stock history:', error);
        throw new Error('Failed to load stock history. Please try again later.');
      })
    );
  }

  // Add this new method to get filtered history
  getFilteredHistory(type?: string, name?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (type || name) {
      url += '?';
      if (type) url += `type=${type}&`;
      if (name) url += `name=${name}`;
    }
    return this.http.get<any[]>(url, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error loading filtered history:', error);
        throw new Error('Failed to load filtered history.');
      })
    );
  }
}