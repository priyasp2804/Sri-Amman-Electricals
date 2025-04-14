import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StockHistoryService } from '../../services/stock-history.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent {
  stockHistory: any[] = [];
  productName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private stockHistoryService: StockHistoryService
  ) {}

  ngOnInit(): void {
    this.productName = this.route.snapshot.paramMap.get('productName');
    this.loadStockHistory();
  }

  loadStockHistory(): void {
    const productName = this.route.snapshot.paramMap.get('productName');
    
    if (productName) {
      this.stockHistoryService.getFilteredHistory('product', productName).subscribe({
        next: (history) => {
          this.stockHistory = history.map(entry => ({
            ...entry,
            userName: entry.employee?.name || 'System',
            userRole: entry.employee?.role || 'System'
          }));
        },
        error: (err) => {
          console.error('Error loading stock history:', err);
          // Add user notification here if needed
        }
      });
    } else {
      this.stockHistoryService.getAllHistory().subscribe({
        next: (history) => {
          this.stockHistory = history.map(entry => ({
            ...entry,
            userName: entry.employee?.name || 'System',
            userRole: entry.employee?.role || 'System'
          }));
        },
        error: (err) => {
          console.error('Error loading stock history:', err);
          // Add user notification here if needed
        }
      });
    }
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.stockHistory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock History');
    XLSX.writeFile(workbook, 'stock-history.xlsx');
  }
}