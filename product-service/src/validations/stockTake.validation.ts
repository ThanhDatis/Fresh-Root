import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createStockTakeSchema = z
  .object({
    scope: z.enum(['all', 'category']),
    categoryId: z.string().regex(objectIdRegex, 'categoryId không hợp lệ').optional(),
    note: z.string().optional(),
  })
  .refine((data) => data.scope !== 'category' || data.categoryId !== undefined, {
    message: 'categoryId là bắt buộc khi scope là category',
    path: ['categoryId'],
  });
export type CreateStockTakeInput = z.infer<typeof createStockTakeSchema>;

export const updateStockTakeSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().regex(objectIdRegex, 'productId không hợp lệ'),
        countedQuantity: z.coerce.number().nonnegative('countedQuantity không được âm'),
      }),
    )
    .min(1, 'items không được để trống'),
});
export type UpdateStockTakeInput = z.infer<typeof updateStockTakeSchema>;

export const listStockTakesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['draft', 'confirmed']).optional(),
});
export type ListStockTakesQuery = z.infer<typeof listStockTakesQuerySchema>;
