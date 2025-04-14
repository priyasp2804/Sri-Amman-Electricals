// app.routes.ts
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

export const routes: Routes = [
  { path: '', component: FirstPageComponent },
  { path: 'owner-login', component: OwnerLoginComponent },
  { path: 'employee-login', component: EmployeeLoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:brand', component: CategoriesComponent }, // Categories filtered by brand
  { path: 'products', component: ProductsComponent },
  { path: 'products/:brand/:category', component: ProductsComponent }, // Products filtered by brand and category
  { path: 'products/:category', component: ProductsComponent },
  { path: 'report-generation', component: ReportGenerationComponent },
  { 
    path: 'stock-history', 
    component: StockHistoryComponent 
  },
  { 
    path: 'stock-history/:productName', 
    component: StockHistoryComponent 
  },
  { path: 'employees', component: EmployeesComponent },
  { path: '**', redirectTo: 'home' }
];