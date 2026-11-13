import { Schema, model, type Types } from 'mongoose';

import {
  CUSTOMER_GROUPS,
  CUSTOMER_STATUSES,
  type CustomerGroup,
  type CustomerStatus,
} from '../constants/order.constants';

export interface ICustomer {
  _id: Types.ObjectId;
  customerCode: string;
  name: string;
  phone: string; // Luôn lưu dạng đã chuẩn hóa (utils/phone.ts)
  email?: string;
  address?: string;
  customerGroup: CustomerGroup;
  note?: string;
  status: CustomerStatus;

  // Số liệu tổng hợp (denormalized) — cập nhật best-effort bằng $inc khi confirm/cancel/return
  totalSpent: number;
  orderCount: number;
  lastPurchaseAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    customerCode: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    customerGroup: { type: String, enum: CUSTOMER_GROUPS, default: 'retail' },
    note: { type: String },
    status: { type: String, enum: CUSTOMER_STATUSES, default: 'active' },

    totalSpent: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    lastPurchaseAt: { type: Date },
  },
  { timestamps: true },
);

customerSchema.index({ customerGroup: 1 });
customerSchema.index({ totalSpent: 1 });
customerSchema.index({ lastPurchaseAt: 1 });

export const CustomerModel = model<ICustomer>('Customer', customerSchema);
