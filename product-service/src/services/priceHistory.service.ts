import { Types } from 'mongoose';

import type { IPriceHistory } from '../models/priceHistory.model';
import { priceHistoryRepository, type PriceHistoryDocument } from '../repositories/priceHistory.repository';

interface LogPriceChangeParams {
  productId: string;
  unitId?: string;
  unitNameSnapshot?: string;
  oldSellPrice: number;
  newSellPrice: number;
  changeType: IPriceHistory['changeType'];
  changedBy: string;
}

async function logPriceChange(params: LogPriceChangeParams): Promise<void> {
  if (params.oldSellPrice === params.newSellPrice) {
    return; // Chỉ log khi giá thực sự đổi (mục 2.5 product-service.md)
  }

  await priceHistoryRepository.create({
    productId: params.productId,
    oldSellPrice: params.oldSellPrice,
    newSellPrice: params.newSellPrice,
    changeType: params.changeType,
    changedBy: params.changedBy,
    ...(params.unitId !== undefined ? { unitId: new Types.ObjectId(params.unitId) } : {}),
    ...(params.unitNameSnapshot !== undefined ? { unitNameSnapshot: params.unitNameSnapshot } : {}),
  });
}

async function getPriceHistory(productId: string): Promise<PriceHistoryDocument[]> {
  return priceHistoryRepository.findByProductId(productId);
}

export const priceHistoryService = {
  logPriceChange,
  getPriceHistory,
};
