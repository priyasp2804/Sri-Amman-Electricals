import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {
  constructor(private router: Router) {}

  navigateToLogin(role: string) {
    if (role === 'owner') {
      this.router.navigate(['/owner-login']);
    } else {
      this.router.navigate(['/employee-login']);
    }
  }
}
