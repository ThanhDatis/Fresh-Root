import { Schema, model, type Types } from 'mongoose';

import {
  FUND_TYPES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  RETURN_STATUSES,
  SALE_MODES,
  type FundType,
  type OrderStatus,
  type PaymentMethod,
  type ReturnStatus,
  type SaleMode,
} from '../constants/order.constants';

export interface IOrderItem {
  _id: Types.ObjectId;
  productId: string; // ref ngoài service (product-service) — KHÔNG populate
  productNameSnapshot: string;
  barcodeSnapshot?: string;
  unitName: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineDiscount: number;
  lineTotal: number;
  allocatedOrderDiscount: number;
  finalLineTotal: number;
  returnedQuantity: number;
  refundedAmount: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderCode?: string; // Chỉ cấp khi confirm
  status: OrderStatus;
  returnStatus: ReturnStatus;
  saleMode: SaleMode;

  customerId?: Types.ObjectId | null;
  customerNameSnapshot?: string;

  employeeId: string;
  employeeNameSnapshot: string;

  items: IOrderItem[];
  subtotal: number;
  orderDiscount: number;
  totalAmount: number;

  paymentMethod?: PaymentMethod;
  fundType?: FundType;
  amountReceived?: number;
  changeAmount?: number;

  note?: string;
  cancelReason?: string;
  cancelledBy?: string;
  cancelledAt?: Date;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// Subdocument giữ _id mặc định — dùng làm orderItemId khi sửa nháp và khi trả hàng
const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productNameSnapshot: { type: String, required: true },
  barcodeSnapshot: { type: String },
  unitName: { type: String, required: true },
  unitPriceSnapshot: { type: Number, required: true },
  quantity: { type: Number, required: true },
  lineDiscount: { type: Number, default: 0 },
  lineTotal: { type: Number, required: true },
  allocatedOrderDiscount: { type: Number, default: 0 },
  finalLineTotal: { type: Number, default: 0 },
  returnedQuantity: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },
});

const orderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String },
    status: { type: String, enum: ORDER_STATUSES, default: 'draft' },
    returnStatus: { type: String, enum: RETURN_STATUSES, default: 'none' },
    saleMode: { type: String, enum: SALE_MODES, required: true },

    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    customerNameSnapshot: { type: String },

    employeeId: { type: String, required: true },
    employeeNameSnapshot: { type: String, required: true },

    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    orderDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    paymentMethod: { type: String, enum: PAYMENT_METHODS },
    fundType: { type: String, enum: FUND_TYPES },
    amountReceived: { type: Number },
    changeAmount: { type: Number },

    note: { type: String },
    cancelReason: { type: String },
    cancelledBy: { type: String },
    cancelledAt: { type: Date },
    confirmedAt: { type: Date },
  },
  // optimisticConcurrency: save() kiểm tra __v và báo VersionError nếu document đã bị request khác sửa (luồng Trả hàng)
  { timestamps: true, optimisticConcurrency: true },
);

// Partial unique: chỉ ràng buộc khi orderCode là string → nhiều draft chưa có mã không đụng nhau
orderSchema.index(
  { orderCode: 1 },
  { unique: true, partialFilterExpression: { orderCode: { $type: 'string' } } },
);
orderSchema.index({ employeeId: 1, status: 1 });
orderSchema.index({ status: 1, confirmedAt: -1 });
orderSchema.index({ customerId: 1 });

export const OrderModel = model<IOrder>('Order', orderSchema);
