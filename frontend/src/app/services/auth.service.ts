// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkOwnerExists(): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/api/owners/owner-exists`);
  }

  registerOwner(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/owners/register`, data);
  }

  loginOwner(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/owners/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'owner');
        localStorage.setItem('name', res.owner.name);
      })
    );
  }

  loginEmployee(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/employees/login`, credentials, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'employee');
        localStorage.setItem('name', res.employee.name);
      })
    );
  }

  getOwnerProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.baseUrl}/api/owners/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getEmployeeProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.baseUrl}/api/employees/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
