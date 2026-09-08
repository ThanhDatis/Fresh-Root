import type { HydratedDocument, Types } from 'mongoose';

import { CategoryModel, type ICategory } from '../models/category.model';

export type CategoryDocument = HydratedDocument<ICategory>;

async function create(data: {
  name: string;
  parentId: Types.ObjectId | null;
}): Promise<CategoryDocument> {
  return CategoryModel.create(data);
}

async function findById(id: string | Types.ObjectId): Promise<CategoryDocument | null> {
  return CategoryModel.findById(id);
}

async function findAll(): Promise<CategoryDocument[]> {
  return CategoryModel.find().sort({ name: 1 });
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<Pick<ICategory, 'name' | 'parentId'>>,
): Promise<CategoryDocument | null> {
  return CategoryModel.findByIdAndUpdate(id, update, { new: true });
}

async function deleteById(id: string | Types.ObjectId): Promise<CategoryDocument | null> {
  return CategoryModel.findByIdAndDelete(id);
}

async function countChildren(id: string | Types.ObjectId): Promise<number> {
  return CategoryModel.countDocuments({ parentId: id });
}

export const categoryRepository = {
  create,
  findById,
  findAll,
  updateById,
  deleteById,
  countChildren,
};