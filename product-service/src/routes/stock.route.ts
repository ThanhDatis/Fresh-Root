import { Router } from 'express';

import { stockController } from '../controllers/stock.controller';
import { validate } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { bulkAdjustStockSchema } from '../validations/product.validation';

const router = Router();

/**
 * @swagger
 * /products/stock/bulk-adjust:
 *   post:
 *     tags: [Stock]
 *     summary: Điều chỉnh tồn kho hàng loạt — atomic, dùng bởi Admin Web và order-service/purchasing-service
 *     description: >
 *       Chỉ cần verifyToken (không giới hạn requireRole admin) vì Thu ngân (role cashier) cũng
 *       gọi vào endpoint này khi bán hàng — request forward nguyên JWT gốc từ order-service/purchasing-service.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkAdjustRequest'
 *     responses:
 *       200:
 *         description: Điều chỉnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId: { type: string }
 *                           unitName: { type: string }
 *                           quantity: { type: number }
 *                           newStockQuantity: { type: number }
 *       404:
 *         description: Không tìm thấy sản phẩm (PRODUCT_NOT_FOUND) hoặc đơn vị quy đổi (PRODUCT_UNIT_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Không đủ tồn kho (PRODUCT_INSUFFICIENT_STOCK) — các item đã trừ trước đó trong lô được compensate tự động
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/bulk-adjust', verifyToken, validate(bulkAdjustStockSchema), stockController.bulkAdjust);

export default router;
