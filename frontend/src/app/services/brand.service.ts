import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:5000/api/brands';

  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };
  }

  getAllBrands(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders())
      .pipe(
        catchError(error => {
          console.error('Error loading brands', error);
          return throwError(() => error);
        })
      );
  }

  addBrand(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { name }, this.getHeaders());
  }

  updateBrand(id: string, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, { name }, this.getHeaders());
  }

  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getHeaders()).pipe(
      catchError(error => {
        if (error.error?.message?.includes("associated categories")) {
          const msg = `Cannot delete: ${error.error.message}\nCategories: ${error.error.categoriesCount}`;
          return throwError(() => new Error(msg));
        }
        return throwError(() => error);
      })
    );
  }
}