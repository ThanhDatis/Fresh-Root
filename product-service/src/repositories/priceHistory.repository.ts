import type { HydratedDocument, Types } from 'mongoose';

import { PriceHistoryModel, type IPriceHistory } from '../models/priceHistory.model';

export type PriceHistoryDocument = HydratedDocument<IPriceHistory>;

async function create(data: {
  productId: string | Types.ObjectId;
  unitId?: Types.ObjectId;
  unitNameSnapshot?: string;
  oldSellPrice: number;
  newSellPrice: number;
  changeType: IPriceHistory['changeType'];
  changedBy: string;
}): Promise<PriceHistoryDocument> {
  return PriceHistoryModel.create(data);
}

async function findByProductId(productId: string | Types.ObjectId): Promise<PriceHistoryDocument[]> {
  return PriceHistoryModel.find({ productId }).sort({ createdAt: -1 });
}

export const priceHistoryRepository = {
  create,
  findByProductId,
};
