import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  isOwner = false;

  constructor(public router: Router) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const role = localStorage.getItem('role');
    this.isOwner = role === 'owner';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    if (window.innerWidth <= 768) {
      this.isCollapsed = false;
    }
  }
}
