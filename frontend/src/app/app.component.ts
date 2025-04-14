import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sri-amman';
  isSidebarOpen = false;

  constructor(public router: Router) {}

  get showLayout(): boolean {
    const allowedRoutes = [
      '/home',
      '/categories',
      '/brands',
      '/products',
      '/stock-history',
      '/employees',
      '/report-generation'
    ];
    return allowedRoutes.some(path => this.router.url.startsWith(path));
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isSidebarOpen = false;
    }
  }
}