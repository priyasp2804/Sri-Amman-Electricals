import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';
  userName = '';

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
  
    this.isLoggedIn = !!token;
  
    if (role === 'owner') {
      this.userRole = 'Owner';
      this.userName = localStorage.getItem('name') || 'Owner';
    } else if (role === 'employee') {
      this.userRole = 'Employee';
      this.userName = localStorage.getItem('name') || 'Employee';
    }
  }
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
