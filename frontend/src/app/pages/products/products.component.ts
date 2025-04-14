import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  brandName: string | null = null;
  categoryName: string | null = null;
  products: any[] = [];
  showAddForm = false;
  editIndex: number | null = null;

  newProduct = {
    name: '',
    category: '',
    brand: '',
    quantity: 0,
    price: 0,
    lastRestockDate: new Date().toISOString().split('T')[0],
    lastRestockQuantity: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.brandName = params.get('brand');
      this.categoryName = params.get('category');
      
      // Handle case when only category is provided
      if (!this.brandName && params.get('category')) {
        this.categoryName = params.get('category');
      }
      
      this.loadProducts();
    });
  }
  
  loadProducts(): void {
    if (this.brandName && this.categoryName) {
      // Load products for specific brand and category
      this.productService.getProductsByBrandAndCategory(this.brandName, this.categoryName).subscribe(
        (products: any) => {
          this.products = products;
          this.newProduct.brand = this.brandName || '';
          this.newProduct.category = this.categoryName || '';
        },
        error => console.error('Error loading products:', error)
      );
    } else if (this.categoryName) {
      // Load products for category only
      this.productService.getProductsByCategory(this.categoryName).subscribe(
        (products: any) => {
          this.products = products;
        },
        error => console.error('Error loading products by category:', error)
      );
    } else {
      // Load all products
      this.productService.getProducts().subscribe(
        (products: any) => this.products = products,
        error => console.error('Error loading all products:', error)
      );
    }
  }

  addProduct() {
    if (!this.newProduct.name.trim()) {
      alert('Product name is required');
      return;
    }
  
    this.newProduct.quantity = Number(this.newProduct.quantity);
    this.newProduct.price = Number(this.newProduct.price);
    this.newProduct.lastRestockQuantity = this.newProduct.quantity;
  
    this.productService.addProduct(this.newProduct).subscribe({
      next: (response: any) => {
        console.log('Product added successfully:', response);
        this.products.push(response.product);
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert(`Error adding product: ${error.message}`);
      }
    });
  }
  
  editProduct(index: number) {
    this.editIndex = index;
    this.newProduct = { ...this.products[index] };
    this.showAddForm = true;
  }

  updateProduct() {
    if (this.editIndex !== null && this.products[this.editIndex]._id) {
      const productId = this.products[this.editIndex]._id;
      this.productService.updateProduct(productId, this.newProduct).subscribe(
        (response: any) => {
          this.products[this.editIndex!] = response.product;
          this.resetForm();
          this.loadProducts();
        },
        error => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  deleteProduct(index: number) {
    if (confirm('Are you sure you want to delete this product?') && this.products[index]._id) {
      const productId = this.products[index]._id;
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.products.splice(index, 1);
          this.loadProducts();
        },
        error => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  viewStockHistory(product: any) {
    this.router.navigate(['/stock-history', product.name]);
  }

  cancelForm() {
    this.resetForm();
  }
  
  resetForm() {
    this.newProduct = {
      name: '',
      category: this.categoryName || '',
      brand: this.brandName || '',
      quantity: 0,
      price: 0,
      lastRestockDate: new Date().toISOString().split('T')[0],
      lastRestockQuantity: 0
    };
    this.editIndex = null;
    this.showAddForm = false;
  }
}