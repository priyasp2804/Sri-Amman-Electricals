import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  newCategory: string = '';
  editedCategory: string = '';
  selectedBrand: string | null = null;
  showAddForm: boolean = false;
  showEditForm: boolean = false;
  editingCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.selectedBrand = params.get('brand');
      this.loadCategories();
    });
  }

  loadCategories() {
    if (this.selectedBrand) {
      this.categoryService.getCategoriesByBrand(this.selectedBrand).subscribe(
        (data) => this.categories = data,
        (error) => console.error('Error loading categories:', error)
      );
    } else {
      this.categoryService.getAllCategories().subscribe(
        (data) => this.categories = data,
        (error) => console.error('Error loading all categories:', error)
      );
    }
  }

  navigateToProducts(category: any) {
    const brand = this.route.snapshot.paramMap.get('brand');
    
    if (brand) {
      // Navigate to products with both brand and category
      this.router.navigate(['/products', brand, category.name]);
    } else {
      // Navigate to products with just category
      this.router.navigate(['/products/category', category.name]);
    }
  }

  addCategory() {
    if (this.newCategory.trim() && this.selectedBrand) {
      const exists = this.categories.some(
        c => c.name.toLowerCase() === this.newCategory.trim().toLowerCase()
      );
      if (exists) {
        alert('This category already exists for this brand!');
        return;
      }

      this.categoryService.addCategory(this.newCategory.trim(), this.selectedBrand).subscribe(
        () => {
          this.newCategory = '';
          this.showAddForm = false;
          this.loadCategories();
        },
        (error) => console.error('Error adding category:', error)
      );
    }
  }

  editCategory(category: any) {
    this.editingCategoryId = category._id ?? null;
    this.editedCategory = category.name;
    this.showEditForm = true;
  }

  saveEdit() {
    if (this.editingCategoryId && this.editedCategory.trim()) {
      const exists = this.categories.some(
        c => c._id !== this.editingCategoryId &&
             c.name.toLowerCase() === this.editedCategory.trim().toLowerCase()
      );
      if (exists) {
        alert('This category name already exists!');
        return;
      }

      this.categoryService.updateCategory(
        this.editingCategoryId, 
        this.editedCategory.trim()
      ).subscribe(
        () => {
          this.cancelEdit();
          this.loadCategories();
        },
        (error) => console.error('Error updating category:', error)
      );
    }
  }

  cancelEdit() {
    this.editingCategoryId = null;
    this.editedCategory = '';
    this.showEditForm = false;
  }

  deleteCategory(category: any) {
    if (category._id && confirm('Are you sure you want to delete this category? This action will be recorded in stock history.')) {
      this.categoryService.deleteCategory(category._id).subscribe({
        next: () => {
          this.loadCategories();
          alert('Category deleted successfully!');
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert(err.message || 'Failed to delete category. Please try again.');
        }
      });
    }
  }
}