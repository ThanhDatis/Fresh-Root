import { Router } from 'express';

import { categoryController } from '../controllers/category.controller';
import { requireRole } from '../middlewares/requireRole.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const router = Router();

router.use(verifyToken);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Category]
 *     summary: Cây danh mục (cha kèm con lồng nhau)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy cây danh mục thành công
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
 *                     categories:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', categoryController.getCategoryTree);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Category]
 *     summary: Tạo danh mục (tối đa 2 cấp)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       404:
 *         description: Không tìm thấy danh mục cha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Vượt quá giới hạn 2 cấp (CATEGORY_MAX_DEPTH_EXCEEDED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/', requireRole('admin'), validate(createCategorySchema), categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     tags: [Category]
 *     summary: Sửa danh mục
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
 *             $ref: '#/components/schemas/CategoryUpdateRequest'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id',
  requireRole('admin'),
  validateObjectId('id'),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Category]
 *     summary: Xóa danh mục — chặn nếu còn danh mục con hoặc sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       409:
 *         description: Còn danh mục con (CATEGORY_HAS_CHILDREN) hoặc còn sản phẩm (CATEGORY_HAS_PRODUCTS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete('/:id', requireRole('admin'), validateObjectId('id'), categoryController.deleteCategory);

export default router;
