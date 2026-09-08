import { Router } from 'express';

import { stockTakeController } from '../controllers/stockTake.controller';
import { requireRole } from '../middlewares/requireRole.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import {
  createStockTakeSchema,
  listStockTakesQuerySchema,
  updateStockTakeSchema,
} from '../validations/stockTake.validation';

const router = Router();

router.use(verifyToken, requireRole('admin'));

/**
 * @swagger
 * /stock-takes:
 *   get:
 *     tags: [Stock Take]
 *     summary: Danh sách phiếu kiểm kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, confirmed] }
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/StockTake' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 */
router.get('/', validate(listStockTakesQuerySchema, 'query'), stockTakeController.listStockTakes);

/**
 * @swagger
 * /stock-takes:
 *   post:
 *     tags: [Stock Take]
 *     summary: Tạo phiếu kiểm mới (draft) — snapshot toàn bộ sản phẩm theo scope
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTakeCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
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
 *                     stockTake: { $ref: '#/components/schemas/StockTake' }
 *       404:
 *         description: Không tìm thấy danh mục (khi scope = category)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/', validate(createStockTakeSchema), stockTakeController.createStockTake);

/**
 * @swagger
 * /stock-takes/{id}:
 *   get:
 *     tags: [Stock Take]
 *     summary: Chi tiết phiếu kiểm kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
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
 *                     stockTake: { $ref: '#/components/schemas/StockTake' }
 *       404:
 *         description: Không tìm thấy phiếu kiểm kho (STOCKTAKE_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/:id', validateObjectId('id'), stockTakeController.getStockTakeById);

/**
 * @swagger
 * /stock-takes/{id}:
 *   patch:
 *     tags: [Stock Take]
 *     summary: Cập nhật số đếm thực tế từng dòng (chỉ khi status draft)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTakeUpdateRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                     stockTake: { $ref: '#/components/schemas/StockTake' }
 *       404:
 *         description: Không tìm thấy phiếu kiểm kho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Phiếu đã xác nhận, không cho sửa nữa (STOCKTAKE_ALREADY_CONFIRMED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id',
  validateObjectId('id'),
  validate(updateStockTakeSchema),
  stockTakeController.updateStockTake,
);

/**
 * @swagger
 * /stock-takes/{id}/confirm:
 *   post:
 *     tags: [Stock Take]
 *     summary: Xác nhận → điều chỉnh tồn kho thực tế, khóa phiếu (bất biến)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xác nhận thành công
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
 *                     stockTake: { $ref: '#/components/schemas/StockTake' }
 *       404:
 *         description: Không tìm thấy phiếu kiểm kho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Phiếu đã xác nhận trước đó (STOCKTAKE_ALREADY_CONFIRMED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/:id/confirm', validateObjectId('id'), stockTakeController.confirmStockTake);

export default router;
