import { z } from 'zod';

import {
  CUSTOMER_GROUPS,
  CUSTOMER_SORTS,
  CUSTOMER_STATUSES,
} from '../constants/order.constants';
import { isValidPhone, normalizePhone } from '../utils/phone';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Chuẩn hóa trước rồi mới kiểm tra định dạng → DB luôn lưu một dạng duy nhất (0xxxxxxxxx)
const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .refine(
    isValidPhone,
    'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)',
  );

// Chuỗi rỗng "" ở các field tùy chọn: khi tạo → bỏ qua, khi sửa → xóa giá trị cũ
const emailSchema = z.union([z.literal(''), z.email('Email không hợp lệ')]);
const optionalTextSchema = z.string().trim().max(500);

// Thời điểm lọc phải có múi giờ (VD 2026-11-01T00:00:00+07:00) để không lệch ngày giữa FE và server
const dateTimeQuerySchema = z.iso
  .datetime({ offset: true, error: 'Thời gian phải theo ISO 8601 có múi giờ' })
  .transform((value) => new Date(value));

// Create customer schema
export const createCustomerSchema = z.object({
  name: z.string().trim().min(1, 'Tên khách hàng không được để trống').max(200),
  phone: phoneSchema,
  email: emailSchema.optional(),
  address: optionalTextSchema.optional(),
  customerGroup: z.enum(CUSTOMER_GROUPS).default('retail'),
  note: optionalTextSchema.optional(),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

// Update customer schema — gửi field nào sửa field đó
export const updateCustomerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Tên khách hàng không được để trống')
      .max(200)
      .optional(),
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    address: optionalTextSchema.optional(),
    customerGroup: z.enum(CUSTOMER_GROUPS).optional(),
    note: optionalTextSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Phải gửi ít nhất một trường cần sửa',
  });
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// Update customer status schema
export const updateCustomerStatusSchema = z.object({
  status: z.enum(CUSTOMER_STATUSES),
});
export type UpdateCustomerStatusInput = z.infer<
  typeof updateCustomerStatusSchema
>;

// Bulk update customer group schema
export const bulkUpdateCustomerGroupSchema = z.object({
  customerIds: z
    .array(z.string().regex(objectIdRegex, 'customerId không hợp lệ'))
    .min(1, 'customerIds không được để trống')
    .max(500, 'Tối đa 500 khách hàng mỗi lần')
    .transform((ids) => [...new Set(ids)]),
  customerGroup: z.enum(CUSTOMER_GROUPS),
});
export type BulkUpdateCustomerGroupInput = z.infer<
  typeof bulkUpdateCustomerGroupSchema
>;

// List customers query schema
export const listCustomersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().min(1).optional(),
    customerGroup: z.enum(CUSTOMER_GROUPS).optional(),
    status: z.enum(CUSTOMER_STATUSES).optional(),
    lastPurchaseFrom: dateTimeQuerySchema.optional(),
    lastPurchaseTo: dateTimeQuerySchema.optional(),
    minSpent: z.coerce.number().nonnegative().optional(),
    maxSpent: z.coerce.number().nonnegative().optional(),
    sort: z.enum(CUSTOMER_SORTS).default('-createdAt'),
  })
  .refine(
    (q) =>
      q.lastPurchaseFrom === undefined ||
      q.lastPurchaseTo === undefined ||
      q.lastPurchaseFrom <= q.lastPurchaseTo,
    {
      message: 'lastPurchaseFrom phải trước hoặc bằng lastPurchaseTo',
      path: ['lastPurchaseFrom'],
    },
  )
  .refine(
    (q) =>
      q.minSpent === undefined ||
      q.maxSpent === undefined ||
      q.minSpent <= q.maxSpent,
    { message: 'minSpent phải nhỏ hơn hoặc bằng maxSpent', path: ['minSpent'] },
  );
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;

// Search customers query schema (panel F4 tại POS)
export const searchCustomersQuerySchema = z.object({
  q: z.string().trim().min(2, 'Nhập tối thiểu 2 ký tự để tìm'),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});
export type SearchCustomersQuery = z.infer<typeof searchCustomersQuerySchema>;
