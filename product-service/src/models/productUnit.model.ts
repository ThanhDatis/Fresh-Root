import { Schema, model, type Types } from 'mongoose';

export interface IProductUnit {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  unitName: string;
  conversionRate: number;
  sellPrice: number;
  isBaseUnit: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const productUnitSchema = new Schema<IProductUnit>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    unitName: { type: String, required: true, trim: true },
    conversionRate: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    isBaseUnit: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productUnitSchema.index({ productId: 1, unitName: 1 }, { unique: true });

export const ProductUnitModel = model<IProductUnit>('ProductUnit', productUnitSchema);