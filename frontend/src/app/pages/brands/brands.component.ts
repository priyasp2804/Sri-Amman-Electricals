import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class BrandsComponent implements OnInit {
  allBrands: { _id?: string; name: string }[] = [];
  filteredBrands: { _id?: string; name: string }[] = [];
  newBrand: string = '';
  editedBrand: string = '';
  selectedCategory: string | null = null;
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  currentlyEditingIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedCategory = params.get('category');
      this.loadBrands();
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe(
      (brands: any) => {
        this.allBrands = brands;
        this.filterBrands();
      },
      error => console.error('Error loading brands:', error)
    );
  }

  filterBrands(): void {
    this.filteredBrands = [...this.allBrands];
  }

  addBrand(): void {
    const trimmed = this.newBrand.trim();
    if (trimmed) {
      const exists = this.allBrands.some(
        b => b.name.toLowerCase() === trimmed.toLowerCase()
      );

      if (exists) {
        alert('This brand already exists!');
        return;
      }

      this.brandService.addBrand(trimmed).subscribe(
        (response: any) => {
          this.allBrands.push(response.brand);
          this.filterBrands();
          this.newBrand = '';
          this.showAddForm = false;
        },
        error => console.error('Error adding brand:', error)
      );
    }
  }

  editBrand(index: number): void {
    this.currentlyEditingIndex = index;
    this.editedBrand = this.filteredBrands[index].name;
    this.showEditForm = true;
  }

  saveEdit(): void {
    if (
      this.currentlyEditingIndex !== null &&
      this.editedBrand.trim() &&
      this.filteredBrands[this.currentlyEditingIndex]._id
    ) {
      const brandId = this.filteredBrands[this.currentlyEditingIndex]._id!;
      const newName = this.editedBrand.trim();

      const exists = this.allBrands.some(
        (b) =>
          b._id !== brandId &&
          b.name.toLowerCase() === newName.toLowerCase()
      );
      if (exists) {
        alert('This brand name already exists!');
        return;
      }

      this.brandService.updateBrand(brandId, newName).subscribe(
        (response: any) => {
          const updatedBrand = response.brand;
          const index = this.allBrands.findIndex(b => b._id === brandId);
          if (index !== -1) {
            this.allBrands[index].name = updatedBrand.name;
          }
          this.filterBrands();
          this.cancelEdit();
          alert('Brand updated successfully');
        },
        error => {
          console.error('Error updating brand:', error);
          alert('Update failed. Try again.');
        }
      );
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.currentlyEditingIndex = null;
    this.editedBrand = '';
  }

  deleteBrand(index: number): void {
    const brand = this.filteredBrands[index];
    if (!brand?._id) {
      alert('Invalid brand selection');
      return;
    }
  
    const confirmed = confirm(`Are you sure you want to permanently delete "${brand.name}"?\n\nThis action will also be recorded in the Stock History.`);
    if (!confirmed) return;
  
    this.brandService.deleteBrand(brand._id).subscribe({
      next: () => {
        this.allBrands = this.allBrands.filter(b => b._id !== brand._id);
        this.filterBrands();
        alert('Brand deleted successfully!');
      },
      error: (err) => {
        console.error('Deletion error:', err);
        let message = 'Cannot delete: An unknown error occurred.';
      
        if (err.error) {
          if (typeof err.error === 'string') {
            message = `Cannot delete: ${err.error}`;
          } else if (err.error.message) {
            message = `Cannot delete: ${err.error.message}`;
            if (typeof err.error.categoriesCount !== 'undefined') {
              message += `\nUsed in ${err.error.categoriesCount} categories`;
            }
          }
        }
      
        alert(message);
      }
    });
  }

  goToProducts(brand: { name: string }): void {
    // Navigation might need to be updated based on your new routing structure
    this.router.navigate(['/categories', brand.name]);
  }
}