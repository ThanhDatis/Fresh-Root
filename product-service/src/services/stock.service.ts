import { AppError } from '../errors/AppError';
// import { ProductModel } from '../models/product.model';
import { productRepository } from '../repositories/product.repository';
import { productUnitRepository } from '../repositories/productUnit.repository';
import { toBaseQuantity } from '../utils/unitConverter';

export type StockAdjustType = 'sale' | 'sale_return' | 'purchase' | 'purchase_return';

export interface StockAdjustItem {
  productId: string;
  unitName: string;
  quantity: number;
}

interface StockAdjustItemResult {
  productId: string;
  unitName: string;
  quantity: number;
  newStockQuantity: number;
}

const DEDUCT_TYPES: StockAdjustType[] = ['sale', 'purchase_return'];

async function resolveBaseQuantity(item: StockAdjustItem): Promise<number> {
  const unit = await productUnitRepository.findByProductIdAndUnitName(item.productId, item.unitName);
  if (!unit) {
    throw new AppError(404, 'Không tìm thấy đơn vị quy đổi', 'PRODUCT_UNIT_NOT_FOUND');
  }
  return toBaseQuantity(item.quantity, unit.conversionRate);
}

async function applyDeduct(productId: string, baseQuantity: number): Promise<number | null> {
  const result = await productRepository.deductStockSufficient(
    productId, 
    baseQuantity,
  );
  return result ? result.stockQuantity : null;
}

async function applyAdd(productId: string, baseQuantity: number): Promise<number> {
  const result = await productRepository.addStock(
    productId,
    baseQuantity,
  );
  if (!result) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
  return result.stockQuantity;
}

async function compensate(productId: string, baseQuantity: number): Promise<void> {
  await productRepository.compensateStock(productId, baseQuantity);
}

async function bulkAdjust(
  type: StockAdjustType,
  items: StockAdjustItem[],
): Promise<StockAdjustItemResult[]> {
  const isDeduct = DEDUCT_TYPES.includes(type);
  const applied: Array<{ productId: string; baseQuantity: number }> = [];
  const results: StockAdjustItemResult[] = [];

  try {
    for (const item of items) {
      const baseQuantity = await resolveBaseQuantity(item);

      if (isDeduct) {
        const newStockQuantity = await applyDeduct(item.productId, baseQuantity);
        if (newStockQuantity === null) {
          throw new AppError(
            422,
            'Không đủ tồn kho để thực hiện giao dịch',
            'PRODUCT_INSUFFICIENT_STOCK',
            [{ field: item.productId, message: 'Không đủ tồn kho' }],
          );
        }
        applied.push({ productId: item.productId, baseQuantity: -baseQuantity });
        results.push({ ...item, newStockQuantity });
      } else {
        const newStockQuantity = await applyAdd(item.productId, baseQuantity);
        applied.push({ productId: item.productId, baseQuantity });
        results.push({ ...item, newStockQuantity });
      }
    }
  } catch (error) {
    // Bất kỳ lỗi nào giữa lô (thiếu tồn, sai unitName, sản phẩm không tồn tại...) đều phải
    // hoàn tác các item ĐÃ trừ thành công trước đó trong cùng lô (mục 4.4 product-service.md)
    for (const applied_ of applied) {
      if (applied_.baseQuantity < 0) {
        await compensate(applied_.productId, -applied_.baseQuantity);
      }
    }
    throw error;
  }

  return results;
}

export const stockService = {
  bulkAdjust,
};
