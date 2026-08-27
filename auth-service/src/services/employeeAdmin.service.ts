import { AppError } from '../errors/AppError';
import { employeeRepository } from '../repositories/employee.repository';
import type { Pagination } from '../types/apiResponse.types';
import type { SafeEmployee } from '../types/auth.types';
import { generateNextEmployeeCode } from '../utils/employeeCode';
import { toSafeEmployee } from '../utils/employeeMapper';
import { hashPassword } from '../utils/hash';
import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
  UpdateEmploymentStatusInput,
} from '../validations/employeeAdmin.validation';

// 5.1. Admin tạo tài khoản Nhân viên
async function createEmployee(
  input: CreateEmployeeInput,
): Promise<SafeEmployee> {
  const existing = await employeeRepository.findByUsername(input.username);
  if (existing) {
    throw new AppError(
      409,
      'Username đã tồn tại',
      'EMPLOYEE_USERNAME_ALREADY_EXISTS',
    );
  }

  const hashedPassword = await hashPassword(input.password);
  const lastEmployee = await employeeRepository.findLastByEmployeeCode();
  const employeeCode = generateNextEmployeeCode(lastEmployee?.employeeCode);

  const employee = await employeeRepository.create({
    employeeCode,
    fullName: input.fullName,
    username: input.username,
    password: hashedPassword,
    role: input.role,
    employmentStatus: 'active',
    ...(input.email !== undefined ? { email: input.email } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
    ...(input.baseSalary !== undefined ? { baseSalary: input.baseSalary } : {}),
  });

  return toSafeEmployee(employee);
}

// GET /admin/employees
async function listEmployees(
  query: ListEmployeesQuery,
): Promise<{ items: SafeEmployee[]; pagination: Pagination }> {
  const { page, limit, search, role, employmentStatus } = query;

  const { items, totalItems } = await employeeRepository.list({
    page,
    limit,
    ...(search !== undefined ? { search } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(employmentStatus !== undefined ? { employmentStatus } : {}),
  });

  return {
    items: items.map(toSafeEmployee),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

// GET /admin/employees/:id
async function getEmployeeById(id: string): Promise<SafeEmployee> {
  const employee = await employeeRepository.findById(id);
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy nhân viên', 'EMPLOYEE_NOT_FOUND');
  }
  return toSafeEmployee(employee);
}

// PATCH /admin/employees/:id — không cho sửa username (mục 5.9)
async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<SafeEmployee> {
  const update = {
    ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.email !== undefined ? { email: input.email } : {}),
    ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
    ...(input.role !== undefined ? { role: input.role } : {}),
    ...(input.startDate !== undefined ? { startDate: input.startDate } : {}),
    ...(input.baseSalary !== undefined ? { baseSalary: input.baseSalary } : {}),
  };

  const employee = await employeeRepository.updateById(id, update);
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy nhân viên', 'EMPLOYEE_NOT_FOUND');
  }
  return toSafeEmployee(employee);
}

// PATCH /admin/employees/:id/status
async function updateEmploymentStatus(
  id: string,
  input: UpdateEmploymentStatusInput,
): Promise<SafeEmployee> {
  const employee = await employeeRepository.updateById(id, {
    employmentStatus: input.employmentStatus,
  });
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy nhân viên', 'EMPLOYEE_NOT_FOUND');
  }

  // Chuyển sang "resigned" -> thu hồi refresh token, không đăng nhập lại được (mục 5.9 bước 3)
  if (input.employmentStatus === 'resigned') {
    await employeeRepository.incrementRefreshTokenVersion(employee._id);
  }

  return toSafeEmployee(employee);
}

export const employeeAdminService = {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmploymentStatus,
};
