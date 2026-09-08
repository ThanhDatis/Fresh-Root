import type { Request, Response } from 'express';

import { stockService, type StockAdjustItem, type StockAdjustType } from '../services/stock.service';
import { sendSuccess } from '../utils/apiResponse';

interface BulkAdjustBody {
  type: StockAdjustType;
  items: StockAdjustItem[];
}

async function bulkAdjust(req: Request, res: Response): Promise<void> {
  const { type, items } = req.body as BulkAdjustBody;
  const results = await stockService.bulkAdjust(type, items);
  sendSuccess(res, 200, 'Điều chỉnh tồn kho thành công', { results });
}

export const stockController = {
  bulkAdjust,
};
