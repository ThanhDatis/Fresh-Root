import type { HydratedDocument, Types } from 'mongoose';

import { ProductUnitModel, type IProductUnit } from '../models/productUnit.model';

export type ProductUnitDocument = HydratedDocument<IProductUnit>;

async function create(data: {
  productId: string | Types.ObjectId;
  unitName: string;
  conversionRate: number;
  sellPrice: number;
  isBaseUnit: boolean;
}): Promise<ProductUnitDocument> {
  return ProductUnitModel.create(data);
}

async function findById(id: string | Types.ObjectId): Promise<ProductUnitDocument | null> {
  return ProductUnitModel.findById(id);
}

async function findByProductId(productId: string | Types.ObjectId): Promise<ProductUnitDocument[]> {
  return ProductUnitModel.find({ productId }).sort({ isBaseUnit: -1, createdAt: 1 });
}

async function findByProductIdAndUnitName(
  productId: string | Types.ObjectId,
  unitName: string,
): Promise<ProductUnitDocument | null> {
  return ProductUnitModel.findOne({ productId, unitName });
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<Pick<IProductUnit, 'unitName' | 'conversionRate' | 'sellPrice'>>,
): Promise<ProductUnitDocument | null> {
  return ProductUnitModel.findByIdAndUpdate(id, update, { new: true });
}

async function deleteById(id: string | Types.ObjectId): Promise<ProductUnitDocument | null> {
  return ProductUnitModel.findByIdAndDelete(id);
}

// Cascade từ Product.sellPrice — gọi trực tiếp ở tầng repository, KHÔNG qua productUnit.service
// để tránh double-log PriceHistory khi nối logic ở Phase 5 (xem product-service.md mục 4.7)
async function updateBaseUnitSellPrice(
  productId: string | Types.ObjectId,
  sellPrice: number,
): Promise<void> {
  await ProductUnitModel.updateOne({ productId, isBaseUnit: true }, { $set: { sellPrice } });
}

export const productUnitRepository = {
  create,
  findById,
  findByProductId,
  findByProductIdAndUnitName,
  updateById,
  deleteById,
  updateBaseUnitSellPrice,
};