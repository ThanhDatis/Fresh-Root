import type { HydratedDocument, QueryFilter, Types } from 'mongoose';

import { ProductModel, type IProduct } from '../models/product.model';
import mongoose from 'mongoose';

export type ProductDocument = HydratedDocument<IProduct>;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function create(data: Partial<IProduct>): Promise<ProductDocument> {
  return ProductModel.create(data);
}

async function findById(id: string | Types.ObjectId): Promise<ProductDocument | null> {
  return ProductModel.findById(id);
}

async function findByBarcode(barcode: string): Promise<ProductDocument | null> {
  return ProductModel.findOne({ barcode });
}

async function findLastByProductCode(): Promise<ProductDocument | null> {
  return ProductModel.findOne().sort({ productCode: -1 });
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<IProduct>,
): Promise<ProductDocument | null> {
  return ProductModel.findByIdAndUpdate(id, update, { new: true });
}

async function countByCategoryId(categoryId: string | Types.ObjectId): Promise<number> {
  return ProductModel.countDocuments({ categoryId });
}

interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  status?: 'active' | 'inactive';
  lowStock?: boolean;
}

interface ListProductsParams extends ProductFilterParams {
  page: number;
  limit: number;
}

interface ListProductsResult {
  items: ProductDocument[];
  totalItems: number;
}

function buildFilter(params: ProductFilterParams): QueryFilter<IProduct> {
  const { search, categoryId, status, lowStock } = params;

  const filter: QueryFilter<IProduct> = {};
  if (categoryId !== undefined) {
    filter.categoryId = new mongoose.Types.ObjectId(categoryId);
  }
  if (status !== undefined) {
    filter.status = status;
  }
  if (search !== undefined && search.trim() !== '') {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: regex }, { barcode: regex }];
  }
  if (lowStock) {
    filter.lowStockThreshold = { $gt: 0 };
    filter.$expr = { $lte: ['$stockQuantity', '$lowStockThreshold'] };
  }
  return filter;
}

async function list(params: ListProductsParams): Promise<ListProductsResult> {
  const { page, limit, ...filterParams } = params;
  const filter = buildFilter(filterParams);

  const [items, totalItems] = await Promise.all([
    ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ProductModel.countDocuments(filter),
  ]);

  return { items, totalItems };
}

async function findAllForExport(params: ProductFilterParams): Promise<ProductDocument[]> {
  const filter = buildFilter(params);
  return ProductModel.find(filter).sort({ createdAt: -1 });
}

async function findByProductCode(productCode: string): Promise<ProductDocument | null> {
  return ProductModel.findOne({ productCode });
}

async function findAllByCategoryId(
  categoryId: string | Types.ObjectId,
): Promise<ProductDocument[]> {
  return ProductModel.find({ categoryId });
}

async function findAll(): Promise<ProductDocument[]> {
  return ProductModel.find();
}

async function deductStockSufficient(
  id: string | Types.ObjectId,
  baseQuantity: number,
): Promise<ProductDocument | null> {
  return ProductModel.findOneAndUpdate(
    { _id: id, stockQuantity: { $gte: baseQuantity } },
    { $inc: { stockQuantity: -baseQuantity } },
    { new: true },
  );
}

async function addStock(
  id: string | Types.ObjectId,
  baseQuantity: number,
): Promise<ProductDocument | null> {
  return ProductModel.findOneAndUpdate(
    { _id: id },
    { $inc: { stockQuantity: baseQuantity } },
    { new: true },
  );
}

async function compensateStock(
  id: string | Types.ObjectId,
  baseQuantity: number,
): Promise<void> {
  await ProductModel.updateOne(
    { _id: id },
    { $inc: { stockQuantity: baseQuantity } },
  );
}

async function setStockQuantity(
  id: string | Types.ObjectId,
  stockQuantity: number,
): Promise<void> {
  await ProductModel.updateOne(
    { _id: id },
    { $set: { stockQuantity } },
  );
}

export const productRepository = {
  create,
  findById,
  findByBarcode,
  findLastByProductCode,
  findAllByCategoryId,
  findAllForExport,
  findByProductCode,
  updateById,
  countByCategoryId,
  list,
  findAll,
  deductStockSufficient,
  addStock,
  compensateStock,
  setStockQuantity,
};