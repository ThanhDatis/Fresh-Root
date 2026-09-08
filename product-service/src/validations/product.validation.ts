import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Create product schema
export const createProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  categoryId: z.string().regex(objectIdRegex, 'categoryId không hợp lệ'),
  barcode: z.string().min(1, 'Barcode không được để trống').optional(),
  images: z.array(z.url('URL ảnh không hợp lệ')).optional(),
  costPrice: z.coerce.number().nonnegative('Giá vốn không được âm'),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0'),
  baseUnitName: z.string().min(1, 'Tên đơn vị cơ bản không được để trống'),
  lowStockThreshold: z.coerce.number().nonnegative().default(0),
  initialStock: z.coerce.number().nonnegative().default(0),
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema
export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().regex(objectIdRegex, 'categoryId không hợp lệ').optional(),
  barcode: z.string().min(1).optional(),
  images: z.array(z.url()).optional(),
  costPrice: z.coerce.number().nonnegative().optional(),
  sellPrice: z.coerce.number().positive().optional(),
  lowStockThreshold: z.coerce.number().nonnegative().optional(),
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Update product status schema
export const updateProductStatusSchema = z.object({
  status: z.enum(['active', 'inactive']),
});
export type UpdateProductStatusInput = z.infer<typeof updateProductStatusSchema>;

// List products query schema
export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().min(1).optional(),
  categoryId: z.string().regex(objectIdRegex).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  lowStock: z.coerce.boolean().optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

// Create product unit schema
export const createProductUnitSchema = z.object({
  unitName: z.string().min(1, 'Tên đơn vị không được để trống'),
  conversionRate: z.coerce.number().gt(1, 'conversionRate phải lớn hơn 1'),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0'),
});
export type CreateProductUnitInput = z.infer<typeof createProductUnitSchema>;

// Update product unit schema
export const updateProductUnitSchema = z.object({
  unitName: z.string().min(1).optional(),
  conversionRate: z.coerce.number().gt(1, 'conversionRate phải lớn hơn 1').optional(),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0').optional(),
});
export type UpdateProductUnitInput = z.infer<typeof updateProductUnitSchema>;

// Bulk adjust stock schema
export const bulkAdjustStockSchema = z.object({
  type: z.enum(['sale', 'sale_return', 'purchase', 'purchase_return']),
  items: z
    .array(
      z.object({
        productId: z.string().regex(objectIdRegex, 'productId không hợp lệ'),
        unitName: z.string().min(1, 'unitName không được để trống'),
        quantity: z.coerce.number().positive('quantity phải lớn hơn 0'),
      }),
    )
    .min(1, 'items không được để trống'),
});
export type BulkAdjustStockInput = z.infer<typeof bulkAdjustStockSchema>;

// Bulk update price schema
export const bulkUpdatePriceSchema = z
  .object({
    productIds: z.array(z.string().regex(objectIdRegex, 'productId không hợp lệ')).optional(),
    categoryId: z.string().regex(objectIdRegex, 'categoryId không hợp lệ').optional(),
    adjustType: z.enum(['percent', 'fixed']),
    value: z.coerce.number().refine((v) => v !== 0, 'value không được bằng 0'),
  })
  .refine((data) => Boolean(data.productIds?.length) || Boolean(data.categoryId), {
    message: 'Phải cung cấp productIds hoặc categoryId',
    path: ['productIds'],
  });
export type BulkUpdatePriceInput = z.infer<typeof bulkUpdatePriceSchema>;
