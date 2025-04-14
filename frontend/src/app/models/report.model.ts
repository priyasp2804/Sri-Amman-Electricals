// report.model.ts
export interface Brand {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  brand: string;
  brandName?: string;
}

export interface Product {
  _id: string;
  name: string;
  brandId: string | Brand;
  categoryId: string | Category;
  quantity: number;
  price: number;
  lastRestockDate?: Date;
  lastRestockQuantity?: number;
  itemsSoldAfterLastRestock?: number;
}

export interface ReportItem {
  productName: string;
  brandName: string;
  categoryName: string;
  quantity: number;
  price: number;
  lastRestockDate?: Date | null;
  lastRestockQuantity?: number;
}

export interface ReportFilters {
  brand?: string;
  category?: string;
  product?: string;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}