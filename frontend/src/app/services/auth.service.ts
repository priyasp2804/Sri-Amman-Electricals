import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // ✔️ Check if owner exists
  checkOwnerExists(): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.baseUrl}/api/owners/owner-exists`);
  }

  // ✔️ Register new owner
  registerOwner(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/owners/register`, data);
  }

  // ✔️ Owner login with token & name storage
  loginOwner(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/owners/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'owner');
        localStorage.setItem('name', res.owner.name); // ✅ Store owner name
      })
    );
  }

  // ✔️ Employee login with token & name storage
  loginEmployee(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/employees/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', 'employee');
        localStorage.setItem('name', res.employee.name); // ✅ Store employee name
      })
    );
  }

  // ✔️ Fetch owner profile
  getOwnerProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.baseUrl}/api/owners/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ✔️ Fetch employee profile
  getEmployeeProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.baseUrl}/api/employees/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
