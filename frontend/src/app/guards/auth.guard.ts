import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/owner-login']);
      return false;
    }

    // ✅ Use bracket notation to fix ts(4111)
    if (next.data['role'] && next.data['role'] !== role) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
