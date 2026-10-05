import { z } from 'zod';

export const createProductFormSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  barcode: z.string().optional(),
  costPrice: z.coerce.number().nonnegative('Giá vốn không được âm'),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0'),
  baseUnitName: z.string().min(1, 'Tên đơn vị cơ bản không được để trống'),
  lowStockThreshold: z.coerce.number().nonnegative().default(0),
  initialStock: z.coerce.number().nonnegative().default(0),
});
export type CreateProductFormValues = z.infer<typeof createProductFormSchema>;

export const updateProductFormSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  barcode: z.string().optional(),
  costPrice: z.coerce.number().nonnegative('Giá vốn không được âm'),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0'),
  lowStockThreshold: z.coerce.number().nonnegative(),
});
export type UpdateProductFormValues = z.infer<typeof updateProductFormSchema>;

export const productUnitFormSchema = z.object({
  unitName: z.string().min(1, 'Tên đơn vị không được để trống'),
  conversionRate: z.coerce.number().gt(1, 'Tỉ lệ quy đổi phải lớn hơn 1'),
  sellPrice: z.coerce.number().positive('Giá bán phải lớn hơn 0'),
});
export type ProductUnitFormValues = z.infer<typeof productUnitFormSchema>;
