import { Routes } from '@angular/router';
import { FirstPageComponent } from './pages/first-page/first-page.component';
import { OwnerLoginComponent } from './pages/owner-login/owner-login.component';
import { EmployeeLoginComponent } from './pages/employee-login/employee-login.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { ProductsComponent } from './pages/products/products.component';
import { StockHistoryComponent } from './pages/stock-history/stock-history.component';
import { ReportGenerationComponent } from './pages/report-generation/report-generation.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { AuthGuard } from './guards/auth.guard';  // Import AuthGuard

export const routes: Routes = [
  { path: '', component: FirstPageComponent },
  { path: 'owner-login', component: OwnerLoginComponent },
  { path: 'employee-login', component: EmployeeLoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:brand', component: CategoriesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:brand/:category', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'report-generation', 
    component: ReportGenerationComponent,
    canActivate: [AuthGuard]
  },
  { path: 'stock-history', 
    component: StockHistoryComponent, 
    canActivate: [AuthGuard] // Protect this route
  },
  { path: 'stock-history/:productName', 
    component: StockHistoryComponent, 
    canActivate: [AuthGuard] // Protect this route
  },
  { path: 'employees', 
    component: EmployeesComponent,
    canActivate: [AuthGuard], // Protect this route
    data: { role: 'owner' }  // Only allow owners to access this route
  },
  { path: '**', redirectTo: 'home' }
];
