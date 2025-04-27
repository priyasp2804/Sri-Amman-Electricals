import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`
      }),
    };
  }

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error loading products', error);
        return throwError(() => error);
      })
    );
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${category}`, this.getHeaders()).pipe(
      catchError(error => {
        console.error(`Error loading products for category ${category}`, error);
        return throwError(() => error);
      })
    );
  }

  getProductsByBrandAndCategory(brand: string, category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${brand}/${category}`, this.getHeaders()).pipe(
      catchError(error => {
        console.error(`Error loading products for brand ${brand} and category ${category}`, error);
        return throwError(() => error);
      })
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, product, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error adding product', error);
        return throwError(() => error);
      })
    );
  }

  updateProduct(productId: string, updatedProduct: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, updatedProduct, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error updating product', error);
        return throwError(() => error);
      })
    );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error deleting product', error);
        return throwError(() => error);
      })
    );
  }
}
