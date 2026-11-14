import type {
  HydratedDocument,
  QueryFilter,
  Types,
  UpdateQuery,
} from 'mongoose';

import type {
  CustomerGroup,
  CustomerSort,
  CustomerStatus,
} from '../constants/order.constants';
import { CustomerModel, type ICustomer } from '../models/customer.model';
import { normalizePhone } from '../utils/phone';

export type CustomerDocument = HydratedDocument<ICustomer>;

export type CustomerSearchItem = Pick<
  ICustomer,
  '_id' | 'customerCode' | 'name' | 'phone' | 'customerGroup'
>;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Chuỗi chỉ gồm chữ số và ký tự phân cách SĐT → coi là tìm theo số điện thoại
function looksLikePhone(text: string): boolean {
  return /^[\d\s.+\-()]+$/.test(text);
}

async function create(data: Partial<ICustomer>): Promise<CustomerDocument> {
  return CustomerModel.create(data);
}

async function findById(
  id: string | Types.ObjectId,
): Promise<CustomerDocument | null> {
  return CustomerModel.findById(id);
}

async function findByPhone(phone: string): Promise<CustomerDocument | null> {
  return CustomerModel.findOne({ phone });
}

async function findByCustomerCode(
  customerCode: string,
): Promise<CustomerDocument | null> {
  return CustomerModel.findOne({ customerCode });
}

async function updateById(
  id: string | Types.ObjectId,
  update: UpdateQuery<ICustomer>,
): Promise<CustomerDocument | null> {
  return CustomerModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
}

async function deleteById(id: string | Types.ObjectId): Promise<void> {
  await CustomerModel.deleteOne({ _id: id });
}

interface CustomerFilterParams {
  search?: string;
  customerGroup?: CustomerGroup;
  status?: CustomerStatus;
  lastPurchaseFrom?: Date;
  lastPurchaseTo?: Date;
  minSpent?: number;
  maxSpent?: number;
}

interface ListCustomersParams extends CustomerFilterParams {
  page: number;
  limit: number;
  sort: CustomerSort;
}

interface ListCustomersResult {
  items: CustomerDocument[];
  totalItems: number;
}

function buildFilter(params: CustomerFilterParams): QueryFilter<ICustomer> {
  const {
    search,
    customerGroup,
    status,
    lastPurchaseFrom,
    lastPurchaseTo,
    minSpent,
    maxSpent,
  } = params;

  const filter: QueryFilter<ICustomer> = {};
  if (customerGroup !== undefined) {
    filter.customerGroup = customerGroup;
  }
  if (status !== undefined) {
    filter.status = status;
  }
  if (search !== undefined && search.trim() !== '') {
    const keyword = search.trim();
    const nameRegex = new RegExp(escapeRegex(keyword), 'i');
    const phoneKeyword = looksLikePhone(keyword)
      ? normalizePhone(keyword)
      : keyword;
    filter.$or = [
      { name: nameRegex },
      { phone: new RegExp(escapeRegex(phoneKeyword)) },
    ];
  }
  if (lastPurchaseFrom !== undefined || lastPurchaseTo !== undefined) {
    filter.lastPurchaseAt = {
      ...(lastPurchaseFrom !== undefined ? { $gte: lastPurchaseFrom } : {}),
      ...(lastPurchaseTo !== undefined ? { $lte: lastPurchaseTo } : {}),
    };
  }
  if (minSpent !== undefined || maxSpent !== undefined) {
    filter.totalSpent = {
      ...(minSpent !== undefined ? { $gte: minSpent } : {}),
      ...(maxSpent !== undefined ? { $lte: maxSpent } : {}),
    };
  }
  return filter;
}

// "-totalSpent" → { totalSpent: -1, _id: -1 }; thêm _id để thứ tự ổn định giữa các trang khi giá trị trùng nhau
function toSortSpec(sort: CustomerSort): Record<string, 1 | -1> {
  const direction = sort.startsWith('-') ? -1 : 1;
  const field = sort.replace(/^-/, '');
  return { [field]: direction, _id: direction };
}

async function list(params: ListCustomersParams): Promise<ListCustomersResult> {
  const { page, limit, sort, ...filterParams } = params;
  const filter = buildFilter(filterParams);

  const [items, totalItems] = await Promise.all([
    CustomerModel.find(filter)
      .sort(toSortSpec(sort))
      .skip((page - 1) * limit)
      .limit(limit),
    CustomerModel.countDocuments(filter),
  ]);

  return { items, totalItems };
}

// Panel F4: chỉ khách active; chuỗi số → khớp TIỀN TỐ SĐT, ngược lại → tên chứa từ khóa
async function search(
  keyword: string,
  limit: number,
): Promise<CustomerSearchItem[]> {
  const isPhoneSearch = looksLikePhone(keyword);
  const filter: QueryFilter<ICustomer> = isPhoneSearch
    ? {
        status: 'active',
        phone: new RegExp(`^${escapeRegex(normalizePhone(keyword))}`),
      }
    : { status: 'active', name: new RegExp(escapeRegex(keyword), 'i') };

  return CustomerModel.find(filter)
    .select('customerCode name phone customerGroup')
    .sort(isPhoneSearch ? { phone: 1 } : { name: 1 })
    .limit(limit)
    .lean<CustomerSearchItem[]>();
}

async function updateGroupByIds(
  ids: string[],
  customerGroup: CustomerGroup,
): Promise<{ matchedCount: number; modifiedCount: number }> {
  const result = await CustomerModel.updateMany(
    { _id: { $in: ids } },
    { $set: { customerGroup } },
  );
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}

export const customerRepository = {
  create,
  findById,
  findByPhone,
  findByCustomerCode,
  updateById,
  deleteById,
  list,
  search,
  updateGroupByIds,
};
