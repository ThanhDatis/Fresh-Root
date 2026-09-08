import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  parentId: z.string().regex(objectIdRegex, 'parentId không hợp lệ').nullable().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').optional(),
  parentId: z.string().regex(objectIdRegex, 'parentId không hợp lệ').nullable().optional(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
