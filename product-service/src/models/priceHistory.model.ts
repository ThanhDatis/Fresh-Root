import { Schema, model, type Types } from 'mongoose';

export interface IPriceHistory {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  unitId?: Types.ObjectId;
  unitNameSnapshot?: string;
  oldSellPrice: number;
  newSellPrice: number;
  changeType: 'manual_edit' | 'bulk_update' | 'purchase_import' | 'unit_price_edit';
  changedBy: string;
  createdAt: Date;
}

const priceHistorySchema = new Schema<IPriceHistory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'ProductUnit' },
    unitNameSnapshot: { type: String },
    oldSellPrice: { type: Number, required: true },
    newSellPrice: { type: Number, required: true },
    changeType: {
      type: String,
      enum: ['manual_edit', 'bulk_update', 'purchase_import', 'unit_price_edit'],
      required: true,
    },
    changedBy: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

priceHistorySchema.index({ productId: 1, createdAt: -1 });

export const PriceHistoryModel = model<IPriceHistory>('PriceHistory', priceHistorySchema);
