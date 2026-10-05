export type ProductStatus = 'active' | 'inactive';

export interface Product {
  _id: string;
  productCode: string;
  name: string;
  description?: string;
  categoryId: string;
  barcode?: string;
  images: string[];
  costPrice: number;
  sellPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductUnit {
  _id: string;
  productId: string;
  unitName: string;
  conversionRate: number;
  sellPrice: number;
  isBaseUnit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithUnits {
  product: Product;
  units: ProductUnit[];
}

export interface Category {
  _id: string;
  name: string;
  parentId: string | null;
  children: Category[];
}

export interface ListProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  lowStock?: boolean;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  categoryId: string;
  barcode?: string;
  costPrice: number;
  sellPrice: number;
  baseUnitName: string;
  lowStockThreshold?: number;
  initialStock?: number;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  barcode?: string;
  costPrice?: number;
  sellPrice?: number;
  lowStockThreshold?: number;
}

export interface CreateProductUnitPayload {
  unitName: string;
  conversionRate: number;
  sellPrice: number;
}

export type UpdateProductUnitPayload = Partial<CreateProductUnitPayload>;

export interface ImportFailedRow {
  row: number;
  message: string;
}

export interface ImportResult {
  successCount: number;
  failedRows: ImportFailedRow[];
}
