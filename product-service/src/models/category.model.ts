import { Schema, model, type Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  parentId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { timestamps: true },
);

categorySchema.index({ parentId: 1 });

export const CategoryModel = model<ICategory>('Category', categorySchema);