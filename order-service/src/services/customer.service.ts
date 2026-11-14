import type {
  CustomerGroup,
  CustomerStatus,
} from '../constants/order.constants';
import { AppError } from '../errors/AppError';
import type { ICustomer } from '../models/customer.model';
import {
  customerRepository,
  type CustomerDocument,
} from '../repositories/customer.repository';
import { orderRepository } from '../repositories/order.repository';
import type { Pagination } from '../types/apiResponse.types';
import { generateCode } from '../utils/sequence';
import type {
  BulkUpdateCustomerGroupInput,
  CreateCustomerInput,
  ListCustomersQuery,
  SearchCustomersQuery,
  UpdateCustomerInput,
} from '../validations/customer.validation';

// Field tùy chọn kiểu chuỗi: "" nghĩa là "để trống" (tạo) hoặc "xóa giá trị" (sửa)
const CLEARABLE_FIELDS = ['email', 'address', 'note'] as const;

export interface CustomerSearchResult {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  customerGroup: CustomerGroup;
}

export interface CustomerDetail {
  customer: CustomerDocument;
  averageOrderValue: number;
}

export type DeleteCustomerResult =
  { action: 'deleted' } | { action: 'blocked'; customer: CustomerDocument };

function phoneAlreadyExistsError(): AppError {
  return new AppError(
    409,
    'Số điện thoại đã tồn tại',
    'CUSTOMER_PHONE_ALREADY_EXISTS',
  );
}

// Lỗi trùng unique index của MongoDB (code 11000) trên đúng field cần kiểm tra
function isDuplicateKeyError(error: unknown, field: string): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const { code, keyPattern } = error as {
    code?: unknown;
    keyPattern?: Record<string, unknown>;
  };
  return code === 11000 && keyPattern !== undefined && field in keyPattern;
}

async function findCustomerOrThrow(id: string): Promise<CustomerDocument> {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    throw new AppError(404, 'Không tìm thấy khách hàng', 'CUSTOMER_NOT_FOUND');
  }
  return customer;
}

// Kiểm tra trước để trả lỗi rõ ràng; unique index vẫn là chốt chặn cuối khi 2 request tạo cùng lúc
async function ensurePhoneAvailable(
  phone: string,
  excludeId?: string,
): Promise<void> {
  const existing = await customerRepository.findByPhone(phone);
  if (existing && existing._id.toString() !== excludeId) {
    throw phoneAlreadyExistsError();
  }
}

async function createCustomer(
  input: CreateCustomerInput,
): Promise<CustomerDocument> {
  await ensurePhoneAvailable(input.phone);
  const customerCode = await generateCode('customer');

  const optionalFields: Partial<ICustomer> = {};
  for (const field of CLEARABLE_FIELDS) {
    const value = input[field];
    if (value !== undefined && value !== '') {
      optionalFields[field] = value;
    }
  }

  try {
    return await customerRepository.create({
      customerCode,
      name: input.name,
      phone: input.phone,
      customerGroup: input.customerGroup,
      status: 'active',
      ...optionalFields,
    });
  } catch (error) {
    if (isDuplicateKeyError(error, 'phone')) {
      throw phoneAlreadyExistsError();
    }
    throw error;
  }
}

async function listCustomers(
  query: ListCustomersQuery,
): Promise<{ items: CustomerDocument[]; pagination: Pagination }> {
  const {
    page,
    limit,
    sort,
    search,
    customerGroup,
    status,
    lastPurchaseFrom,
    lastPurchaseTo,
    minSpent,
    maxSpent,
  } = query;

  const { items, totalItems } = await customerRepository.list({
    page,
    limit,
    sort,
    ...(search !== undefined ? { search } : {}),
    ...(customerGroup !== undefined ? { customerGroup } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(lastPurchaseFrom !== undefined ? { lastPurchaseFrom } : {}),
    ...(lastPurchaseTo !== undefined ? { lastPurchaseTo } : {}),
    ...(minSpent !== undefined ? { minSpent } : {}),
    ...(maxSpent !== undefined ? { maxSpent } : {}),
  });

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}

async function searchCustomers(
  query: SearchCustomersQuery,
): Promise<CustomerSearchResult[]> {
  const items = await customerRepository.search(query.q, query.limit);
  return items.map((item) => ({
    id: item._id.toString(),
    customerCode: item.customerCode,
    name: item.name,
    phone: item.phone,
    customerGroup: item.customerGroup,
  }));
}

async function getCustomerById(id: string): Promise<CustomerDetail> {
  const customer = await findCustomerOrThrow(id);
  const averageOrderValue =
    customer.orderCount > 0
      ? Math.round(customer.totalSpent / customer.orderCount)
      : 0;
  return { customer, averageOrderValue };
}

async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<CustomerDocument> {
  await findCustomerOrThrow(id);
  if (input.phone !== undefined) {
    await ensurePhoneAvailable(input.phone, id);
  }

  const $set: Partial<ICustomer> = {};
  const $unset: Partial<Record<(typeof CLEARABLE_FIELDS)[number], ''>> = {};

  if (input.name !== undefined) {
    $set.name = input.name;
  }
  if (input.phone !== undefined) {
    $set.phone = input.phone;
  }
  if (input.customerGroup !== undefined) {
    $set.customerGroup = input.customerGroup;
  }
  for (const field of CLEARABLE_FIELDS) {
    const value = input[field];
    if (value === '') {
      $unset[field] = '';
    } else if (value !== undefined) {
      $set[field] = value;
    }
  }

  try {
    const updated = await customerRepository.updateById(id, {
      $set,
      ...(Object.keys($unset).length > 0 ? { $unset } : {}),
    });
    if (!updated) {
      throw new AppError(
        404,
        'Không tìm thấy khách hàng',
        'CUSTOMER_NOT_FOUND',
      );
    }
    return updated;
  } catch (error) {
    if (isDuplicateKeyError(error, 'phone')) {
      throw phoneAlreadyExistsError();
    }
    throw error;
  }
}

async function updateCustomerStatus(
  id: string,
  status: CustomerStatus,
): Promise<CustomerDocument> {
  const updated = await customerRepository.updateById(id, {
    $set: { status },
  });
  if (!updated) {
    throw new AppError(404, 'Không tìm thấy khách hàng', 'CUSTOMER_NOT_FOUND');
  }
  return updated;
}

// Đã có hóa đơn (kể cả nháp) → chỉ chuyển blocked để giữ lịch sử; chưa từng có → xóa cứng (order-service.md mục 2.2)
async function deleteCustomer(id: string): Promise<DeleteCustomerResult> {
  const customer = await findCustomerOrThrow(id);

  const hasOrders = await orderRepository.existsByCustomerId(customer._id);
  if (hasOrders) {
    const blocked = await customerRepository.updateById(id, {
      $set: { status: 'blocked' },
    });
    return { action: 'blocked', customer: blocked ?? customer };
  }

  await customerRepository.deleteById(id);
  return { action: 'deleted' };
}

async function bulkUpdateGroup(
  input: BulkUpdateCustomerGroupInput,
): Promise<{ matchedCount: number; modifiedCount: number }> {
  return customerRepository.updateGroupByIds(
    input.customerIds,
    input.customerGroup,
  );
}

export const customerService = {
  createCustomer,
  listCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  bulkUpdateGroup,
};
