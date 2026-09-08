import { AppError } from '../errors/AppError';
import { productRepository } from '../repositories/product.repository';
import { productUnitRepository, type ProductUnitDocument } from '../repositories/productUnit.repository';
import type { CreateProductUnitInput, UpdateProductUnitInput } from '../validations/product.validation';
import { priceHistoryService } from './priceHistory.service';

async function assertProductExists(productId: string): Promise<void> {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
}

async function addUnit(productId: string, input: CreateProductUnitInput): Promise<ProductUnitDocument> {
  await assertProductExists(productId);

  const duplicated = await productUnitRepository.findByProductIdAndUnitName(productId, input.unitName);
  if (duplicated) {
    throw new AppError(409, 'Trùng tên đơn vị trong cùng sản phẩm', 'PRODUCT_UNIT_DUPLICATE_NAME');
  }

  return productUnitRepository.create({
    productId,
    unitName: input.unitName,
    conversionRate: input.conversionRate,
    sellPrice: input.sellPrice,
    isBaseUnit: false,
  });
}

async function updateUnit(
  productId: string,
  unitId: string,
  input: UpdateProductUnitInput,
  changedBy: string,
): Promise<ProductUnitDocument> {
  const unit = await productUnitRepository.findById(unitId);
  if (!unit || unit.productId.toString() !== productId) {
    throw new AppError(404, 'Không tìm thấy đơn vị quy đổi', 'PRODUCT_UNIT_NOT_FOUND');
  }

  if (unit.isBaseUnit && input.sellPrice !== undefined) {
    throw new AppError(
      422,
      'Không thể sửa giá đơn vị cơ bản qua endpoint này — sửa qua PATCH /products/:id',
      'PRODUCT_UNIT_BASE_PRICE_READONLY',
    );
  }

  if (input.unitName !== undefined && input.unitName !== unit.unitName) {
    const duplicated = await productUnitRepository.findByProductIdAndUnitName(productId, input.unitName);
    if (duplicated) {
      throw new AppError(409, 'Trùng tên đơn vị trong cùng sản phẩm', 'PRODUCT_UNIT_DUPLICATE_NAME');
    }
  }

  const sellPriceChanged = input.sellPrice !== undefined && input.sellPrice !== unit.sellPrice;

  const updated = await productUnitRepository.updateById(unitId, {
    ...(input.unitName !== undefined ? { unitName: input.unitName } : {}),
    ...(input.conversionRate !== undefined ? { conversionRate: input.conversionRate } : {}),
    ...(input.sellPrice !== undefined ? { sellPrice: input.sellPrice } : {}),
    // Ghi PriceHistory changeType 'unit_price_edit' khi sellPrice đổi sẽ nối ở Phase 5
  });

  if (!updated) {
    throw new AppError(404, 'Không tìm thấy đơn vị quy đổi', 'PRODUCT_UNIT_NOT_FOUND');
  }

  if (sellPriceChanged) {
    await priceHistoryService.logPriceChange({
      productId,
      unitId,
      unitNameSnapshot: updated.unitName,
      oldSellPrice: unit.sellPrice,
      newSellPrice: updated.sellPrice,
      changeType: 'unit_price_edit',
      changedBy,
    });
  }
  return updated;
}

async function deleteUnit(productId: string, unitId: string): Promise<void> {
  const unit = await productUnitRepository.findById(unitId);
  if (!unit || unit.productId.toString() !== productId) {
    throw new AppError(404, 'Không tìm thấy đơn vị quy đổi', 'PRODUCT_UNIT_NOT_FOUND');
  }

  if (unit.isBaseUnit) {
    throw new AppError(422, 'Không thể xóa đơn vị cơ bản', 'PRODUCT_UNIT_CANNOT_DELETE_BASE');
  }

  await productUnitRepository.deleteById(unitId);
}

export const productUnitService = {
  addUnit,
  updateUnit,
  deleteUnit,
};
