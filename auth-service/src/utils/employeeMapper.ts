import type { EmployeeDocument } from '../repositories/employee.repository';
import type { SafeEmployee } from '../types/auth.types';

// Ẩn password/resetPasswordTokenHash — dùng chung cho auth.service.ts và employeeAdmin.service.ts
export function toSafeEmployee(employee: EmployeeDocument): SafeEmployee {
  return {
    id: employee._id.toString(),
    employeeCode: employee.employeeCode,
    fullName: employee.fullName,
    username: employee.username,
    ...(employee.email !== undefined ? { email: employee.email } : {}),
    ...(employee.phone !== undefined ? { phone: employee.phone } : {}),
    ...(employee.avatar !== undefined ? { avatar: employee.avatar } : {}),
    role: employee.role,
    employmentStatus: employee.employmentStatus,
    ...(employee.startDate !== undefined
      ? { startDate: employee.startDate }
      : {}),
    ...(employee.baseSalary !== undefined
      ? { baseSalary: employee.baseSalary }
      : {}),
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}
