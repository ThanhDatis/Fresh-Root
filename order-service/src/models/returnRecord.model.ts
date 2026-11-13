import { Schema, model, type Types } from 'mongoose';

import {
  FUND_TYPES,
  REFUND_METHODS,
  RETURN_REASONS,
  type FundType,
  type RefundMethod,
  type ReturnReason,
} from '../constants/order.constants';

export interface IReturnItem {
  orderItemId: Types.ObjectId;
  productId: string;
  productNameSnapshot: string;
  unitName: string;
  unitPriceSnapshot: number;
  quantity: number;
  refundAmount: number;
}

export interface IReturnRecord {
  _id: Types.ObjectId;
  returnCode: string;
  requestId: string; // Do FE sinh — unique, chống submit trùng
  orderId: Types.ObjectId;
  orderCodeSnapshot: string;

  items: IReturnItem[];
  totalRefundAmount: number;

  reason: ReturnReason;
  reasonNote?: string;

  refundMethod: RefundMethod;
  refundFundType?: FundType;

  employeeId: string;
  employeeNameSnapshot: string;

  createdAt: Date;
}

const returnItemSchema = new Schema<IReturnItem>(
  {
    orderItemId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: String, required: true },
    productNameSnapshot: { type: String, required: true },
    unitName: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true },
    quantity: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
  },
  { _id: false },
);

const returnRecordSchema = new Schema<IReturnRecord>(
  {
    returnCode: { type: String, required: true, unique: true },
    requestId: { type: String, required: true, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderCodeSnapshot: { type: String, required: true },

    items: { type: [returnItemSchema], default: [] },
    totalRefundAmount: { type: Number, required: true },

    reason: { type: String, enum: RETURN_REASONS, required: true },
    reasonNote: { type: String },

    refundMethod: { type: String, enum: REFUND_METHODS, required: true },
    refundFundType: { type: String, enum: FUND_TYPES },

    employeeId: { type: String, required: true },
    employeeNameSnapshot: { type: String, required: true },
  },
  // Phiếu trả hàng không bao giờ sửa sau khi tạo → chỉ cần createdAt
  { timestamps: { createdAt: true, updatedAt: false } },
);

returnRecordSchema.index({ orderId: 1 });

export const ReturnRecordModel = model<IReturnRecord>(
  'ReturnRecord',
  returnRecordSchema,
);
