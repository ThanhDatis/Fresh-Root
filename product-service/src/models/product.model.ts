import { Schema, model, type Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId;
  productCode: string;
  name: string;
  description?: string;
  categoryId: Types.ObjectId;
  barcode?: string;
  images: string[];

  costPrice: number;
  sellPrice: number;

  stockQuantity: number;
  lowStockThreshold: number;

  status: 'active' | 'inactive';

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    productCode: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    barcode: { type: String, unique: true, sparse: true },
    images: { type: [String], default: [] },

    costPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },

    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);

productSchema.index({ categoryId: 1 });
productSchema.index({ name: 'text' });

export const ProductModel = model<IProduct>('Product', productSchema);