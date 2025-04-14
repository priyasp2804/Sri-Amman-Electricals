import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isOwner = false;
  isEmployee = false;
  userName = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const role = localStorage.getItem('role');
    this.isOwner = role === 'owner';
    this.isEmployee = role === 'employee';

    if (this.isOwner) {
      this.authService.getOwnerProfile().subscribe({
        next: (res) => {
          this.userName = res.name;
        },
        error: () => {
          this.userName = 'Owner';
        }
      });
    }

    if (this.isEmployee) {
      this.authService.getEmployeeProfile().subscribe({
        next: (res) => {
          this.userName = res.name;
        },
        error: () => {
          this.userName = 'Employee';
        }
      });
    }
  }
}
