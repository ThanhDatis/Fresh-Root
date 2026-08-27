import type { HydratedDocument, QueryFilter, Types } from 'mongoose';

import { EmployeeModel, type IEmployee } from '../models/employee.model';

export type EmployeeDocument = HydratedDocument<IEmployee>;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findByUsername(
  username: string,
  withPassword = false,
): Promise<EmployeeDocument | null> {
  const query = EmployeeModel.findOne({ username: username.toLowerCase() });
  return withPassword ? query.select('+password') : query;
}

async function findByEmail(email: string): Promise<EmployeeDocument | null> {
  return EmployeeModel.findOne({ email: email.toLowerCase() });
}

async function findById(
  id: string | Types.ObjectId,
  withPassword = false,
): Promise<EmployeeDocument | null> {
  const query = EmployeeModel.findById(id);
  return withPassword ? query.select('+password') : query;
}

async function findLastByEmployeeCode(): Promise<EmployeeDocument | null> {
  return EmployeeModel.findOne().sort({ employeeCode: -1 });
}

async function create(data: Partial<IEmployee>): Promise<EmployeeDocument> {
  return EmployeeModel.create(data);
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<IEmployee>,
): Promise<EmployeeDocument | null> {
  return EmployeeModel.findByIdAndUpdate(id, update, { new: true });
}

async function incrementRefreshTokenVersion(
  id: string | Types.ObjectId,
): Promise<void> {
  await EmployeeModel.updateOne(
    { _id: id },
    { $inc: { refreshTokenVersion: 1 } },
  );
}

async function clearResetPasswordToken(
  id: string | Types.ObjectId,
): Promise<void> {
  await EmployeeModel.updateOne(
    { _id: id },
    { $unset: { resetPasswordTokenHash: '', resetPasswordExpires: '' } },
  );
}

interface ListEmployeesParams {
  page: number;
  limit: number;
  search?: string;
  role?: 'admin' | 'cashier';
  employmentStatus?: 'active' | 'resigned';
}

interface ListEmployeesResult {
  items: EmployeeDocument[];
  totalItems: number;
}

async function list(params: ListEmployeesParams): Promise<ListEmployeesResult> {
  const { page, limit, search, role, employmentStatus } = params;

  const filter: QueryFilter<IEmployee> = {};
  if (role !== undefined) {
    filter.role = role;
  }
  if (employmentStatus !== undefined) {
    filter.employmentStatus = employmentStatus;
  }
  if (search !== undefined && search.trim() !== '') {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [
      { fullName: regex },
      { username: regex },
      { employeeCode: regex },
    ];
  }

  const [items, totalItems] = await Promise.all([
    EmployeeModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    EmployeeModel.countDocuments(filter),
  ]);

  return { items, totalItems };
}

export const employeeRepository = {
  findByUsername,
  findByEmail,
  findById,
  findLastByEmployeeCode,
  create,
  updateById,
  incrementRefreshTokenVersion,
  clearResetPasswordToken,
  list,
};
