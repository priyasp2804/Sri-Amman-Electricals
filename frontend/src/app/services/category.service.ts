import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error loading categories', error);
        return throwError(() => error);
      })
    );
  }

  getCategoriesByBrand(brandName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brand/${brandName}`, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error loading categories by brand', error);
        return throwError(() => error);
      })
    );
  }

  addCategory(name: string, brandName: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`, 
      { name, brand: brandName }, 
      this.getHeaders()
    ).pipe(
      catchError(error => {
        console.error('Error adding category', error);
        return throwError(() => error);
      })
    );
  }

  updateCategory(id: string, name: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/edit/${id}`, 
      { name }, 
      this.getHeaders()
    ).pipe(
      catchError(error => {
        console.error('Error updating category', error);
        return throwError(() => error);
      })
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/delete/${id}`, 
      this.getHeaders()
    ).pipe(
      catchError(error => {
        if (error.error?.message === "Cannot delete category with associated products") {
          const msg = `Cannot delete: ${error.error.message}\nProducts: ${error.error.productsCount}`;
          return throwError(() => new Error(msg));
        }
        console.error('Error deleting category', error);
        return throwError(() => error);
      })
    );
  }
}