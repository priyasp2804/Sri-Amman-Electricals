// report-generation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ReportGenerationService } from '../../services/report-generation.service';
import { Brand, Category, Product, ReportItem, ReportFilters } from '../../models/report.model';

@Component({
  selector: 'app-report-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.css']
})
export class ReportGenerationComponent implements OnInit {
  brands: Brand[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  filteredCategories: Category[] = [];
  filteredProducts: Product[] = [];
  reportData: ReportItem[] = [];
  errorMessage: string | null = null;
  isLoading = false;
  hasFilters = false;

  filters: ReportFilters = {
    brand: '',
    category: '',
    product: '',
    minQuantity: null,
    maxQuantity: null,
    minPrice: null,
    maxPrice: null
  };

  constructor(private reportService: ReportGenerationService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.reportService.getBrands().subscribe({
      next: data => this.brands = data,
      error: err => this.handleError('Failed to load brands', err)
    });

    this.reportService.getCategories().subscribe({
      next: data => {
        this.categories = data;
        this.filteredCategories = [...data];
      },
      error: err => this.handleError('Failed to load categories', err)
    });

    this.reportService.getProducts().subscribe({
      next: data => {
        this.products = data;
        this.filteredProducts = [...data];
        this.isLoading = false;
      },
      error: err => this.handleError('Failed to load products', err)
    });
  }

  handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    this.errorMessage = `${message}. Please try again.`;
    this.isLoading = false;
  }

  onBrandChange(): void {
    const selectedBrandId = this.filters.brand;
    
    if (!selectedBrandId) {
      this.resetCategoryAndProductFilters();
      return;
    }
  
    this.filteredCategories = this.categories.filter(c => c.brand === selectedBrandId);
    this.filteredProducts = this.products.filter(p => {
      if (!p.brandId) return false;
      const brandId = typeof p.brandId === 'string' ? p.brandId : p.brandId._id;
      return brandId === selectedBrandId;
    });
  
    this.resetSecondaryFilters();
  }  
  
  onCategoryChange(): void {
    const selectedCategoryId = this.filters.category;
    this.filteredProducts = this.products.filter(p => {
      const categoryId = typeof p.categoryId === 'string' ? p.categoryId : p.categoryId?._id;
      return categoryId === selectedCategoryId;
    });
    this.filters.product = '';
    this.updateFilterStatus();
  }

  private resetCategoryAndProductFilters(): void {
    this.filteredCategories = [...this.categories];
    this.filteredProducts = [...this.products];
    this.filters.category = '';
    this.filters.product = '';
    this.updateFilterStatus();
  }

  private resetSecondaryFilters(): void {
    this.filters.category = '';
    this.filters.product = '';
    this.updateFilterStatus();
  }
  
  updateFilterStatus(): void {
    this.hasFilters = Object.values(this.filters).some(
      val => val !== '' && val !== null && val !== undefined
    );
  }

  generateReport(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = null;

    const params: any = {
      brand: this.filters.brand || undefined,
      category: this.filters.category || undefined,
      product: this.filters.product || undefined,
      minQuantity: this.filters.minQuantity || undefined,
      maxQuantity: this.filters.maxQuantity || undefined,
      minPrice: this.filters.minPrice || undefined,
      maxPrice: this.filters.maxPrice || undefined
    };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    this.reportService.generateReport(params).subscribe({
      next: data => {
        this.reportData = data.map(item => ({
          ...item,
          lastRestockDate: item.lastRestockDate ? new Date(item.lastRestockDate) : null,
          lastRestockQuantity: item.lastRestockQuantity || 0
        }));
        this.isLoading = false;
      },
      error: err => {
        this.handleError('Failed to generate report', err);
      }
    });
  }

  exportToExcel(): void {
    if (this.reportData.length === 0) {
      this.errorMessage = 'No data available to export';
      return;
    }

    try {
      const excelData = this.reportData.map(item => ({
        'Product Name': item.productName,
        'Brand': item.brandName,
        'Category': item.categoryName,
        'Quantity': item.quantity,
        'Price': item.price,
        'Last Restock Date': item.lastRestockDate?.toISOString().split('T')[0] || '',
        'Last Restock Quantity': item.lastRestockQuantity || 0
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      this.handleError('Failed to export report', err);
    }
  }

  resetFilters(): void {
    this.filters = {
      brand: '',
      category: '',
      product: '',
      minQuantity: null,
      maxQuantity: null,
      minPrice: null,
      maxPrice: null
    };
    this.filteredCategories = [...this.categories];
    this.filteredProducts = [...this.products];
    this.reportData = [];
    this.hasFilters = false;
    this.errorMessage = null;
  }
}