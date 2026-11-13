// ---------- Order ----------
export const ORDER_STATUSES = [
  'draft',
  'confirming',
  'completed',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const RETURN_STATUSES = ['none', 'partial', 'full'] as const;
export type ReturnStatus = (typeof RETURN_STATUSES)[number];

export const SALE_MODES = ['quick', 'normal', 'delivery'] as const;
export type SaleMode = (typeof SALE_MODES)[number];

export const PAYMENT_METHODS = ['cash', 'bank_transfer'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const FUND_TYPES = ['cash', 'bank'] as const;
export type FundType = (typeof FUND_TYPES)[number];

// ---------- Return ----------
export const RETURN_REASONS = [
  'defective',
  'changed_mind',
  'wrong_delivery',
  'other',
] as const;
export type ReturnReason = (typeof RETURN_REASONS)[number];

export const REFUND_METHODS = ['cash', 'debt_deduction'] as const;
export type RefundMethod = (typeof REFUND_METHODS)[number];

// ---------- Customer ----------
export const CUSTOMER_GROUPS = ['retail', 'wholesale', 'vip'] as const;
export type CustomerGroup = (typeof CUSTOMER_GROUPS)[number];

export const CUSTOMER_STATUSES = ['active', 'blocked'] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

// ---------- Mã tự sinh (HD0001, TH0001, KH0001) ----------
export const CODE_PREFIXES = {
  order: 'HD',
  return: 'TH',
  customer: 'KH',
} as const;
export type SequenceKey = keyof typeof CODE_PREFIXES;

export const CODE_PAD_LENGTH = 4;

// ---------- Số lượng ----------
// Số lượng cho phép tối đa 3 chữ số thập phân (VD: 1.25 Kg)
export const QUANTITY_DECIMALS = 3;
