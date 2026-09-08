import type { Request, Response } from 'express';

import { stockTakeService } from '../services/stockTake.service';
import { sendPaginated, sendSuccess } from '../utils/apiResponse';
import type {
  CreateStockTakeInput,
  ListStockTakesQuery,
  UpdateStockTakeInput,
} from '../validations/stockTake.validation';

async function createStockTake(req: Request, res: Response): Promise<void> {
  const stockTake = await stockTakeService.createStockTake(
    req.body as CreateStockTakeInput,
    req.user!.userId,
  );
  sendSuccess(res, 201, 'Tạo phiếu kiểm kho thành công', { stockTake });
}

async function listStockTakes(req: Request, res: Response): Promise<void> {
  const { items, pagination } = await stockTakeService.listStockTakes(
    req.query as unknown as ListStockTakesQuery,
  );
  sendPaginated(res, 'Lấy danh sách phiếu kiểm kho thành công', items, pagination);
}

async function getStockTakeById(req: Request, res: Response): Promise<void> {
  const stockTake = await stockTakeService.getStockTakeById(req.params.id as string);
  sendSuccess(res, 200, 'Lấy chi tiết phiếu kiểm kho thành công', { stockTake });
}

async function updateStockTake(req: Request, res: Response): Promise<void> {
  const stockTake = await stockTakeService.updateStockTake(
    req.params.id as string,
    req.body as UpdateStockTakeInput,
  );
  sendSuccess(res, 200, 'Cập nhật phiếu kiểm kho thành công', { stockTake });
}

async function confirmStockTake(req: Request, res: Response): Promise<void> {
  const stockTake = await stockTakeService.confirmStockTake(req.params.id as string, req.user!.userId);
  sendSuccess(res, 200, 'Xác nhận phiếu kiểm kho thành công', { stockTake });
}

export const stockTakeController = {
  createStockTake,
  listStockTakes,
  getStockTakeById,
  updateStockTake,
  confirmStockTake,
};
