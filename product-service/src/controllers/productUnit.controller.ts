import type { Request, Response } from 'express';

import { productUnitService } from '../services/productUnit.service';
import { sendSuccess } from '../utils/apiResponse';
import type { CreateProductUnitInput, UpdateProductUnitInput } from '../validations/product.validation';

async function addUnit(req: Request, res: Response): Promise<void> {
  const unit = await productUnitService.addUnit(
    req.params.id as string,
    req.body as CreateProductUnitInput,
  );
  sendSuccess(res, 201, 'Thêm đơn vị quy đổi thành công', { unit });
}

async function updateUnit(req: Request, res: Response): Promise<void> {
  const unit = await productUnitService.updateUnit(
    req.params.id as string,
    req.params.unitId as string,
    req.body as UpdateProductUnitInput,
    req.user!.userId,
  );
  sendSuccess(res, 200, 'Sửa đơn vị quy đổi thành công', { unit });
}

async function deleteUnit(req: Request, res: Response): Promise<void> {
  await productUnitService.deleteUnit(req.params.id as string, req.params.unitId as string);
  sendSuccess(res, 200, 'Xóa đơn vị quy đổi thành công', null);
}

export const productUnitController = {
  addUnit,
  updateUnit,
  deleteUnit,
};
