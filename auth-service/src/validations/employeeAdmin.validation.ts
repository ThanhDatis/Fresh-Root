import { z } from 'zod';

export const employeeIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID nhân viên không hợp lệ'),
});
export type EmployeeIdParam = z.infer<typeof employeeIdParamSchema>;

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
  password: z.string().min(8, 'Password phải có ít nhất 8 ký tự'),
  role: z.enum(['admin', 'cashier']),
  email: z.email('Email không hợp lệ').optional(),
  phone: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  baseSalary: z.coerce
    .number()
    .nonnegative('Lương cơ bản không được âm')
    .optional(),
});
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

// Không cho sửa username (auth-service.md mục 5.9)
export const updateEmployeeSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').optional(),
  phone: z.string().min(1).optional(),
  email: z.email('Email không hợp lệ').optional(),
  avatar: z.url('Avatar phải là URL hợp lệ').optional(),
  role: z.enum(['admin', 'cashier']).optional(),
  startDate: z.coerce.date().optional(),
  baseSalary: z.coerce
    .number()
    .nonnegative('Lương cơ bản không được âm')
    .optional(),
});
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export const updateEmploymentStatusSchema = z.object({
  employmentStatus: z.enum(['active', 'resigned']),
});
export type UpdateEmploymentStatusInput = z.infer<
  typeof updateEmploymentStatusSchema
>;

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().min(1).optional(),
  role: z.enum(['admin', 'cashier']).optional(),
  employmentStatus: z.enum(['active', 'resigned']).optional(),
});
export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
