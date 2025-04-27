import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  checkOwnerExists(): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.baseUrl}/api/owners/owner-exists`,
      this.getHeaders()
    );
  }

  registerOwner(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/owners/register`, 
      data,
      this.getHeaders()
    );
  }

  loginOwner(credentials: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/owners/login`, 
      credentials,
      this.getHeaders()
    ).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'owner');
        localStorage.setItem('name', res.owner.name);
      })
    );
  }

  loginEmployee(credentials: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/employees/login`, 
      credentials,
      this.getHeaders()
    ).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'employee');
        localStorage.setItem('name', res.employee.name);
      })
    );
  }

  getOwnerProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/owners/profile`,
      this.getAuthHeaders()
    );
  }

  getEmployeeProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/employees/profile`,
      this.getAuthHeaders()
    );
  }
}