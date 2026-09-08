import type { HydratedDocument, Types } from 'mongoose';

import { StockTakeModel, type IStockTake } from '../models/stockTake.model';

export type StockTakeDocument = HydratedDocument<IStockTake>;

async function create(data: Partial<IStockTake>): Promise<StockTakeDocument> {
  return StockTakeModel.create(data);
}

async function findById(id: string | Types.ObjectId): Promise<StockTakeDocument | null> {
  return StockTakeModel.findById(id);
}

async function findLastByStockTakeCode(): Promise<StockTakeDocument | null> {
  return StockTakeModel.findOne().sort({ stockTakeCode: -1 });
}

interface ListStockTakesParams {
  page: number;
  limit: number;
  status?: 'draft' | 'confirmed';
}

interface ListStockTakesResult {
  items: StockTakeDocument[];
  totalItems: number;
}

async function list(params: ListStockTakesParams): Promise<ListStockTakesResult> {
  const { page, limit, status } = params;
  const filter = status !== undefined ? { status } : {};

  const [items, totalItems] = await Promise.all([
    StockTakeModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    StockTakeModel.countDocuments(filter),
  ]);

  return { items, totalItems };
}

async function updateCountedQuantities(
  id: string | Types.ObjectId,
  countedByProductId: Map<string, number>,
): Promise<StockTakeDocument | null> {
  const stockTake = await StockTakeModel.findById(id);
  if (!stockTake) {
    return null;
  }

  for (const item of stockTake.items) {
    const counted = countedByProductId.get(item.productId.toString());
    if (counted !== undefined) {
      item.countedQuantity = counted;
    }
  }

  await stockTake.save();
  return stockTake;
}

async function confirm(id: string | Types.ObjectId, confirmedBy: string): Promise<StockTakeDocument | null> {
  return StockTakeModel.findByIdAndUpdate(
    id,
    { status: 'confirmed', confirmedBy, confirmedAt: new Date() },
    { new: true },
  );
}

export const stockTakeRepository = {
  create,
  findById,
  findLastByStockTakeCode,
  list,
  updateCountedQuantities,
  confirm,
};
