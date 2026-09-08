import { Schema, model, type Types } from 'mongoose';

export interface IStockTakeItem {
  productId: Types.ObjectId;
  productNameSnapshot: string;
  systemQuantity: number;
  countedQuantity: number | null;
}

export interface IStockTake {
  _id: Types.ObjectId;
  stockTakeCode: string;
  scope: 'all' | 'category';
  categoryId?: Types.ObjectId;
  status: 'draft' | 'confirmed';
  items: IStockTakeItem[];
  note?: string;

  createdBy: string;
  confirmedBy?: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const stockTakeItemSchema = new Schema<IStockTakeItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productNameSnapshot: { type: String, required: true },
    systemQuantity: { type: Number, required: true },
    countedQuantity: { type: Number, default: null },
  },
  { _id: false },
);

const stockTakeSchema = new Schema<IStockTake>(
  {
    stockTakeCode: { type: String, required: true, unique: true },
    scope: { type: String, enum: ['all', 'category'], required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    status: { type: String, enum: ['draft', 'confirmed'], default: 'draft' },
    items: { type: [stockTakeItemSchema], default: [] },
    note: { type: String },

    createdBy: { type: String, required: true },
    confirmedBy: { type: String },
    confirmedAt: { type: Date },
  },
  { timestamps: true },
);

export const StockTakeModel = model<IStockTake>('StockTake', stockTakeSchema);
