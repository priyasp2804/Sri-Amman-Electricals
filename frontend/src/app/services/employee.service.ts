import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employee {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/api/employees`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl, this.getHeaders());
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      `${this.baseUrl}/register`, 
      employee,
      this.getHeaders()
    );
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.baseUrl}/${id}`,
      employee,
      this.getHeaders()
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      this.getHeaders()
    );
  }
}