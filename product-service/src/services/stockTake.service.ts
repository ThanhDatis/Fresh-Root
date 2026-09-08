import { Types } from 'mongoose';

import { AppError } from '../errors/AppError';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';
import { stockTakeRepository, type StockTakeDocument } from '../repositories/stockTake.repository';
import type { Pagination } from '../types/apiResponse.types';
import { generateNextStockTakeCode } from '../utils/stockTakeCode';
import type {
  CreateStockTakeInput,
  ListStockTakesQuery,
  UpdateStockTakeInput,
} from '../validations/stockTake.validation';

async function createStockTake(input: CreateStockTakeInput, createdBy: string): Promise<StockTakeDocument> {
  let products;

  if (input.scope === 'category') {
    // Zod đã validate categoryId bắt buộc khi scope === 'category' (validations/stockTake.validation.ts)
    const categoryId = input.categoryId as string;
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
    }
    products = await productRepository.findAllByCategoryId(categoryId);
  } else {
    products = await productRepository.findAll();
  }

  const items = products.map((product) => ({
    productId: product._id,
    productNameSnapshot: product.name,
    systemQuantity: product.stockQuantity,
    countedQuantity: null,
  }));

  const lastStockTake = await stockTakeRepository.findLastByStockTakeCode();
  const stockTakeCode = generateNextStockTakeCode(lastStockTake?.stockTakeCode);

  return stockTakeRepository.create({
    stockTakeCode,
    scope: input.scope,
    ...(input.categoryId !== undefined ? { categoryId: new Types.ObjectId(input.categoryId) } : {}),
    status: 'draft',
    items,
    ...(input.note !== undefined ? { note: input.note } : {}),
    createdBy,
  });
}

async function listStockTakes(
  query: ListStockTakesQuery,
): Promise<{ items: StockTakeDocument[]; pagination: Pagination }> {
  const { page, limit, status } = query;
  const { items, totalItems } = await stockTakeRepository.list({
    page,
    limit,
    ...(status !== undefined ? { status } : {}),
  });
  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}

async function getStockTakeById(id: string): Promise<StockTakeDocument> {
  const stockTake = await stockTakeRepository.findById(id);
  if (!stockTake) {
    throw new AppError(404, 'Không tìm thấy phiếu kiểm kho', 'STOCKTAKE_NOT_FOUND');
  }
  return stockTake;
}

async function updateStockTake(id: string, input: UpdateStockTakeInput): Promise<StockTakeDocument> {
  const stockTake = await getStockTakeById(id);
  if (stockTake.status === 'confirmed') {
    throw new AppError(422, 'Phiếu đã xác nhận, không cho sửa nữa', 'STOCKTAKE_ALREADY_CONFIRMED');
  }

  const countedByProductId = new Map(input.items.map((item) => [item.productId, item.countedQuantity]));
  const updated = await stockTakeRepository.updateCountedQuantities(id, countedByProductId);
  if (!updated) {
    throw new AppError(404, 'Không tìm thấy phiếu kiểm kho', 'STOCKTAKE_NOT_FOUND');
  }
  return updated;
}

async function confirmStockTake(id: string, confirmedBy: string): Promise<StockTakeDocument> {
  const stockTake = await getStockTakeById(id);
  if (stockTake.status === 'confirmed') {
    throw new AppError(422, 'Phiếu đã xác nhận, không cho sửa nữa', 'STOCKTAKE_ALREADY_CONFIRMED');
  }

  for (const item of stockTake.items) {
    if (item.countedQuantity !== null && item.countedQuantity !== item.systemQuantity) {
      await productRepository.setStockQuantity(item.productId, item.countedQuantity);
    }
  }

  const confirmed = await stockTakeRepository.confirm(id, confirmedBy);
  if (!confirmed) {
    throw new AppError(404, 'Không tìm thấy phiếu kiểm kho', 'STOCKTAKE_NOT_FOUND');
  }
  return confirmed;
}

export const stockTakeService = {
  createStockTake,
  listStockTakes,
  getStockTakeById,
  updateStockTake,
  confirmStockTake,
};
