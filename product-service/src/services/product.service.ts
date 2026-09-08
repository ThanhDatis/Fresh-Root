import { Types } from 'mongoose';

import { AppError } from '../errors/AppError';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository, type ProductDocument } from '../repositories/product.repository';
import { productUnitRepository, type ProductUnitDocument } from '../repositories/productUnit.repository';
import type { Pagination } from '../types/apiResponse.types';
import { generateNextProductCode } from '../utils/productCode';
import type {
  BulkUpdatePriceInput,
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from '../validations/product.validation';
import { priceHistoryService } from './priceHistory.service';
import { buildWorkbookBuffer, readWorkbookRows } from '../utils/excel';

interface ProductWithUnits {
  product: ProductDocument;
  units: ProductUnitDocument[];
}

// Lấy sản phẩm cùng với các đơn vị tính liên quan
async function getProductWithUnits(id: string): Promise<ProductWithUnits> {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
  const units = await productUnitRepository.findByProductId(id);
  return { product, units };
}

// Tạo sản phẩm mới cùng với đơn vị cơ bản
async function createProduct(input: CreateProductInput): Promise<ProductWithUnits> {
  const category = await categoryRepository.findById(input.categoryId);
  if (!category) {
    throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
  }

  if (input.barcode !== undefined) {
    const duplicated = await productRepository.findByBarcode(input.barcode);
    if (duplicated) {
      throw new AppError(409, 'Mã vạch đã tồn tại', 'PRODUCT_BARCODE_ALREADY_EXISTS');
    }
  }

  const lastProduct = await productRepository.findLastByProductCode();
  const productCode = generateNextProductCode(lastProduct?.productCode);

  let product: ProductDocument;
  try {
    product = await productRepository.create({
      productCode,
      name: input.name,
      categoryId: new Types.ObjectId(input.categoryId),
      costPrice: input.costPrice,
      sellPrice: input.sellPrice,
      stockQuantity: input.initialStock,
      lowStockThreshold: input.lowStockThreshold,
      images: input.images ?? [],
      status: 'active',
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.barcode !== undefined ? { barcode: input.barcode } : {}),
    });
  } catch (error) {
    const isDuplicateProductCode =
      error instanceof Error && 'code' in error && (error as { code?: number }).code === 11000;
    if (isDuplicateProductCode) {
      // Race condition hiếm gặp giữa lúc sinh productCode và lúc insert (mục 10 product-service.md)
      throw new AppError(409, 'Mã sản phẩm đã tồn tại, vui lòng thử lại', 'PRODUCT_CODE_ALREADY_EXISTS');
    }
    throw error;
  }

  const baseUnit = await productUnitRepository.create({
    productId: product._id,
    unitName: input.baseUnitName,
    conversionRate: 1,
    sellPrice: product.sellPrice,
    isBaseUnit: true,
  });

  return { product, units: [baseUnit] };
}

// Danh sách sản phẩm với phân trang
async function listProducts(
  query: ListProductsQuery,
): Promise<{ items: ProductDocument[]; pagination: Pagination }> {
  const { page, limit, search, categoryId, status, lowStock } = query;

  const { items, totalItems } = await productRepository.list({
    page,
    limit,
    ...(search !== undefined ? { search } : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(lowStock !== undefined ? { lowStock } : {}),
  });

  return {
    items,
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}

// Lấy sản phẩm theo ID
async function getProductById(id: string): Promise<ProductWithUnits> {
  return getProductWithUnits(id);
}

// Lấy sản phẩm theo mã vạch
async function getProductByBarcode(barcode: string): Promise<ProductWithUnits> {
  const product = await productRepository.findByBarcode(barcode);
  if (!product || product.status !== 'active') {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
  const units = await productUnitRepository.findByProductId(product._id);
  return { product, units };
}

// Cập nhật thông tin sản phẩm
async function updateProduct(
  id: string, 
  input: UpdateProductInput,
  changedBy: string,
): Promise<ProductDocument> {
  const existing = await productRepository.findById(id);
  if (!existing) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }

  if (input.categoryId !== undefined) {
    const category = await categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new AppError(404, 'Không tìm thấy danh mục', 'CATEGORY_NOT_FOUND');
    }
  }

  if (input.barcode !== undefined && input.barcode !== existing.barcode) {
    const duplicated = await productRepository.findByBarcode(input.barcode);
    if (duplicated) {
      throw new AppError(409, 'Mã vạch đã tồn tại', 'PRODUCT_BARCODE_ALREADY_EXISTS');
    }
  }

  const sellPriceChanged = input.sellPrice !== undefined && input.sellPrice !== existing.sellPrice;

  const updated = await productRepository.updateById(id, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.categoryId !== undefined ? { categoryId: new Types.ObjectId(input.categoryId) } : {}),
    ...(input.barcode !== undefined ? { barcode: input.barcode } : {}),
    ...(input.images !== undefined ? { images: input.images } : {}),
    ...(input.costPrice !== undefined ? { costPrice: input.costPrice } : {}),
    ...(input.sellPrice !== undefined ? { sellPrice: input.sellPrice } : {}),
    ...(input.lowStockThreshold !== undefined ? { lowStockThreshold: input.lowStockThreshold } : {}),
  });

  if (!updated) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }

  if (sellPriceChanged) {
    await priceHistoryService.logPriceChange({
      productId: id,
      oldSellPrice: existing.sellPrice,
      newSellPrice: updated.sellPrice,
      changeType: 'manual_edit',
      changedBy,
    })
    // Cascade xuống base unit — ghi PriceHistory sẽ nối ở Phase 5
    await productUnitRepository.updateBaseUnitSellPrice(id, updated.sellPrice);
  }

  return updated;
}

// Cập nhật trạng thái sản phẩm
async function updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<ProductDocument> {
  const updated = await productRepository.updateById(id, { status });
  if (!updated) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
  return updated;
}

// Xóa mềm sản phẩm (chỉ thay đổi trạng thái)
async function softDeleteProduct(id: string): Promise<ProductDocument> {
  return updateProductStatus(id, 'inactive');
}

// Lấy lịch sử giá của sản phẩm
async function getPriceHistory(productId: string) {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError(404, 'Không tìm thấy sản phẩm', 'PRODUCT_NOT_FOUND');
  }
  return priceHistoryService.getPriceHistory(productId);
}

// Tính giá bán mới dựa trên giá hiện tại, loại điều chỉnh và giá trị điều chỉnh
function computeNewSellPrice(
  currentPrice: number,
  adjustType: 'percent' | 'fixed',
  value: number,
): number {
  if (adjustType === 'percent') {
    return Math.round(currentPrice * (1 + value / 100));
  }
  return currentPrice + value;
}

// Xác định các sản phẩm bị ảnh hưởng bởi việc điều chỉnh giá hàng loạt
async function resolveAffectedProducts(
  input: BulkUpdatePriceInput,
): Promise<ProductDocument[]> {
  if (input.productIds && input.productIds.length > 0) {
    const products = await Promise.all(input.productIds
      .map((id) => productRepository.findById(id)));
    return products.filter((p): p is ProductDocument => p !== null);
  }
  if (input.categoryId) {
    return productRepository.findAllByCategoryId(input.categoryId);
  }
  return [];
}

// Điều chỉnh giá bán hàng loạt cho các sản phẩm được xác định
async function bulkUpdatePrice(
  input: BulkUpdatePriceInput,
  changedBy: string,
): Promise<ProductDocument[]> {
  const products = await resolveAffectedProducts(input);

  // Kiểm tra xem có sản phẩm nào bị ảnh hưởng không
  const plannedUpdates = products.map((product) => ({
    product,
    newSellPrice: computeNewSellPrice(product.sellPrice, input.adjustType, input.value),
  }));
  const invalid = plannedUpdates.find((p) => p.newSellPrice <= 0);
  if (invalid) {
    throw new AppError(
      422, 
      `Giá bán sau khi điều chỉnh của sản phẩm "${invalid.product.name}" phải lớn hơn 0`, 
      'PRODUCT_INVALID_SELL_PRICE');
  }

  // Thực hiện cập nhật giá bán và ghi nhận lịch sử giá
  const updatedProducts: ProductDocument[] = [];
  for (const { product, newSellPrice } of plannedUpdates) {
    if (newSellPrice !== product.sellPrice) {
      await priceHistoryService.logPriceChange({
        productId: product._id.toString(),
        oldSellPrice: product.sellPrice,
        newSellPrice,
        changeType: 'bulk_update',
        changedBy,
      });
    }

    const updated = await productRepository.updateById(
      product._id, 
      { sellPrice: newSellPrice }
    );
    if (updated) {
      await productUnitRepository.updateBaseUnitSellPrice(
        product._id, 
        newSellPrice
      );
      updatedProducts.push(updated);
    }
  }
  return updatedProducts;
}

interface ImportResult {
  successCount: number;
  failedRows: Array<{ row: number; message: string }>;
}

// Nhập sản phẩm từ file Excel
async function importProducts(buffer: Buffer): Promise<ImportResult> {
  const rows = await readWorkbookRows(buffer);
  const categories = await categoryRepository.findAll();
  const categoryByName = new Map(categories.map((c) => [c.name.trim().toLowerCase(), c]));

  const result: ImportResult = { successCount: 0, failedRows: [] };

  // Duyệt từng dòng trong file Excel
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // +1 header, +1 vì Excel đánh số từ 1

    try {
      const productCode = row?.['Mã sản phẩm']?.trim();
      const name = row?.['Tên sản phẩm']?.trim();
      const categoryName = row?.['Danh mục']?.trim();
      const costPrice = Number(row?.['Giá vốn']);
      const sellPrice = Number(row?.['Giá bán']);

      if (!name) {
        throw new Error('Tên sản phẩm không được để trống');
      }
      const category = categoryName ? categoryByName.get(categoryName.toLowerCase()) : undefined;
      if (!category) {
        throw new Error(`Không tìm thấy danh mục "${categoryName ?? ''}"`);
      }
      if (Number.isNaN(costPrice) || Number.isNaN(sellPrice)) {
        throw new Error('Giá vốn/Giá bán không hợp lệ');
      }

      if (productCode) {
        const existing = await productRepository.findByProductCode(productCode);
        if (!existing) {
          throw new Error(`Không tìm thấy sản phẩm có mã "${productCode}"`);
        }
        await productRepository.updateById(existing._id, {
          name,
          categoryId: category._id,
          costPrice,
          sellPrice,
          ...(row?.['Mã vạch'] ? { barcode: row['Mã vạch'].trim() } : {}),
          ...(row?.['Ngưỡng cảnh báo'] ? { lowStockThreshold: Number(row['Ngưỡng cảnh báo']) } : {}),
        });
      } else {
        const baseUnitName = row?.['Đơn vị cơ bản']?.trim();
        if (!baseUnitName) {
          throw new Error('Đơn vị cơ bản không được để trống khi tạo mới');
        }

        await createProduct({
          name,
          categoryId: category._id.toString(),
          costPrice,
          sellPrice,
          baseUnitName,
          lowStockThreshold: Number(row?.['Ngưỡng cảnh báo'] ?? 0),
          initialStock: Number(row?.['Tồn kho ban đầu'] ?? 0),
          ...(row?.['Mã vạch'] ? { barcode: row['Mã vạch'].trim() } : {}),
        });
      }

      result.successCount += 1;
    } catch (error) {
      result.failedRows.push({
        row: rowNumber,
        message: error instanceof Error ? error.message : 'Lỗi không xác định',
      });
    }
  }

  return result;
}

const EXPORT_COLUMNS = [
  'Mã sản phẩm',
  'Tên sản phẩm',
  'Danh mục',
  'Mã vạch',
  'Giá vốn',
  'Giá bán',
  'Tồn kho',
  'Ngưỡng cảnh báo',
  'Trạng thái',
];

// Xuất danh sách sản phẩm ra file Excel
async function exportProducts(query: ListProductsQuery): Promise<Buffer> {
  // Lấy danh sách sản phẩm dựa trên các tham số lọc
  const products = await productRepository.findAllForExport({
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(query.categoryId !== undefined ? { categoryId: query.categoryId } : {}),
    ...(query.status !== undefined ? { status: query.status } : {}),
    ...(query.lowStock !== undefined ? { lowStock: query.lowStock } : {}),
  });
  // Lấy danh sách danh mục để ánh xạ tên danh mục theo ID
  const categories = await categoryRepository.findAll();
  const categoryNameById = new Map(categories.map((c) => [c._id.toString(), c.name]));
  // Chuyển đổi danh sách sản phẩm thành định dạng phù hợp để xuất ra Excel
  const rows = products.map((product) => ({
    'Mã sản phẩm': product.productCode,
    'Tên sản phẩm': product.name,
    'Danh mục': categoryNameById.get(product.categoryId.toString()) ?? '',
    'Mã vạch': product.barcode ?? '',
    'Giá vốn': product.costPrice,
    'Giá bán': product.sellPrice,
    'Tồn kho': product.stockQuantity,
    'Ngưỡng cảnh báo': product.lowStockThreshold,
    'Trạng thái': product.status === 'active' ? 'Đang bán' : 'Ngừng bán',
  }));

  return buildWorkbookBuffer(EXPORT_COLUMNS, rows);
}

export const productService = {
  createProduct,
  listProducts,
  getProductById,
  getProductByBarcode,
  getPriceHistory,
  updateProduct,
  updateProductStatus,
  softDeleteProduct,
  bulkUpdatePrice,
  importProducts,
  exportProducts,
};
