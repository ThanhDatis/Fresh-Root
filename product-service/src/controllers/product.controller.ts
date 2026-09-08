import type { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

import { productService } from '../services/product.service';
import { sendPaginated, sendSuccess } from '../utils/apiResponse';
import type {
  BulkUpdatePriceInput,
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
  UpdateProductStatusInput,
} from '../validations/product.validation';

async function createProduct(req: Request, res: Response): Promise<void> {
  const result = await productService.createProduct(req.body as CreateProductInput);
  sendSuccess(res, 201, 'Tạo sản phẩm thành công', result);
}

async function listProducts(req: Request, res: Response): Promise<void> {
  const { items, pagination } = await productService.listProducts(
    req.query as unknown as ListProductsQuery,
  );
  sendPaginated(res, 'Lấy danh sách sản phẩm thành công', items, pagination);
}

async function getProductById(req: Request, res: Response): Promise<void> {
  const result = await productService.getProductById(req.params.id as string);
  sendSuccess(res, 200, 'Lấy chi tiết sản phẩm thành công', result);
}

async function getProductByBarcode(req: Request, res: Response): Promise<void> {
  const result = await productService.getProductByBarcode(req.params.barcode as string);
  sendSuccess(res, 200, 'Tra cứu sản phẩm thành công', result);
}

async function updateProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.updateProduct(
    req.params.id as string,
    req.body as UpdateProductInput,
    req.user!.userId,
  );
  sendSuccess(res, 200, 'Cập nhật sản phẩm thành công', { product });
}

async function updateProductStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body as UpdateProductStatusInput;
  const product = await productService.updateProductStatus(req.params.id as string, status);
  sendSuccess(res, 200, 'Cập nhật trạng thái sản phẩm thành công', { product });
}

async function deleteProduct(req: Request, res: Response): Promise<void> {
  const product = await productService.softDeleteProduct(req.params.id as string);
  sendSuccess(res, 200, 'Xóa sản phẩm thành công', { product });
}

async function getPriceHistory(req: Request, res: Response): Promise<void> {
  const history = await productService.getPriceHistory(req.params.id as string);
  sendSuccess(res, 200, 'Lấy lịch sử giá sản phẩm thành công', { history });
}

async function bulkUpdatePrice(req: Request, res: Response): Promise<void> {
  const products = await productService.bulkUpdatePrice(
    req.body as BulkUpdatePriceInput,
    req.user!.userId,
  );
  sendSuccess(res, 200, 'Cập nhật giá sản phẩm hàng loạt thành công', { products });
}

async function importProducts(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw new AppError(400, 'Vui lòng chọn file Excel', 'VALIDATION_REQUIRED_FIELD');
  }
  const result = await productService.importProducts(req.file.buffer);
  sendSuccess(res, 200, 'Import sản phẩm hoàn tất', result);
}

async function exportProducts(req: Request, res: Response): Promise<void> {
  const buffer = await productService.exportProducts(req.query as unknown as ListProductsQuery);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="products.xlsx"');
  res.send(buffer);
}

export const productController = {
  createProduct,
  listProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getPriceHistory,
  bulkUpdatePrice,
  importProducts,
  exportProducts,
};
