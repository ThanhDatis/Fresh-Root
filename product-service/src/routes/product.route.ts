import { Router } from 'express';
import multer from 'multer';

import { productController } from '../controllers/product.controller';
import { productUnitController } from '../controllers/productUnit.controller';
import { requireRole } from '../middlewares/requireRole.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import {
  bulkUpdatePriceSchema,
  createProductSchema,
  createProductUnitSchema,
  listProductsQuerySchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateProductUnitSchema,
} from '../validations/product.validation';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file là 5MB
});

router.use(verifyToken);

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Product]
 *     summary: Danh sách sản phẩm — phân trang, tìm kiếm, lọc
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
 *         name: search
 *         schema: { type: string }
 *         description: Tìm theo tên/mã vạch
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *       - in: query
 *         name: lowStock
 *         schema: { type: boolean }
 *         description: Lọc sản phẩm tồn kho thấp (stockQuantity <= lowStockThreshold, bỏ qua ngưỡng = 0)
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */
router.get('/', validate(listProductsQuerySchema, 'query'), productController.listProducts);

/**
 * @swagger
 * /products/export:
 *   get:
 *     tags: [Product]
 *     summary: Export Excel (theo bộ lọc áp dụng)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *       - in: query
 *         name: lowStock
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: File Excel (.xlsx) danh sách sản phẩm khớp bộ lọc
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema: { type: string, format: binary }
 */
router.get(
  '/export',
  requireRole('admin'),
  validate(listProductsQuerySchema, 'query'),
  productController.exportProducts,
);

/**
 * @swagger
 * /products/barcode/{barcode}:
 *   get:
 *     tags: [Product]
 *     summary: Tra cứu nhanh theo mã vạch — dùng cho quét tại POS
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tra cứu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithUnitsResponse'
 *       404:
 *         description: Không tìm thấy (sai mã vạch hoặc sản phẩm đang inactive)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/barcode/:barcode', productController.getProductByBarcode);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Chi tiết sản phẩm (kèm danh sách đơn vị quy đổi)
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
 *               $ref: '#/components/schemas/ProductWithUnitsResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/:id', validateObjectId('id'), productController.getProductById);

/**
 * @swagger
 * /products/{id}/price-history:
 *   get:
 *     tags: [Product]
 *     summary: Lịch sử thay đổi giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PriceHistoryResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get(
  '/:id/price-history',
  requireRole('admin'),
  validateObjectId('id'),
  productController.getPriceHistory,
);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Product]
 *     summary: Tạo sản phẩm (tự tạo kèm ProductUnit cơ bản)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithUnitsResponse'
 *       404:
 *         description: Không tìm thấy danh mục (CATEGORY_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng mã vạch (PRODUCT_BARCODE_ALREADY_EXISTS) hoặc trùng mã sản phẩm (PRODUCT_CODE_ALREADY_EXISTS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/', requireRole('admin'), validate(createProductSchema), productController.createProduct);

/**
 * @swagger
 * /products/import:
 *   post:
 *     tags: [Product]
 *     summary: Import Excel (dòng có "Mã sản phẩm" khớp -> update, để trống -> tạo mới)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import hoàn tất — trả kèm báo cáo dòng lỗi (nếu có)
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
 *                     successCount: { type: integer }
 *                     failedRows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row: { type: integer }
 *                           message: { type: string }
 *       400:
 *         description: Thiếu file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/import', requireRole('admin'), upload.single('file'), productController.importProducts);

/**
 * @swagger
 * /products/bulk-price:
 *   patch:
 *     tags: [Product]
 *     summary: Sửa giá hàng loạt (theo % hoặc số tiền cố định)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkUpdatePriceRequest'
 *     responses:
 *       200:
 *         description: Sửa giá hàng loạt thành công
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
 *                     products:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Product' }
 *       422:
 *         description: Giá sau điều chỉnh <= 0 ở ít nhất 1 sản phẩm (PRODUCT_INVALID_SELL_PRICE) — không có sản phẩm nào bị đổi giá
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/bulk-price',
  requireRole('admin'),
  validate(bulkUpdatePriceSchema),
  productController.bulkUpdatePrice,
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     tags: [Product]
 *     summary: Sửa thông tin sản phẩm (không sửa stockQuantity trực tiếp)
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
 *             $ref: '#/components/schemas/ProductUpdateRequest'
 *     responses:
 *       200:
 *         description: Sửa thành công (nếu sellPrice đổi, tự cascade xuống base unit + ghi PriceHistory)
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
 *                     product: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Không tìm thấy sản phẩm hoặc danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng mã vạch (PRODUCT_BARCODE_ALREADY_EXISTS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id',
  requireRole('admin'),
  validateObjectId('id'),
  validate(updateProductSchema),
  productController.updateProduct,
);

/**
 * @swagger
 * /products/{id}/status:
 *   patch:
 *     tags: [Product]
 *     summary: Kích hoạt / Vô hiệu hóa sản phẩm
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
 *             $ref: '#/components/schemas/ProductStatusUpdateRequest'
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id/status',
  requireRole('admin'),
  validateObjectId('id'),
  validate(updateProductStatusSchema),
  productController.updateProductStatus,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Xóa sản phẩm — soft-delete luôn, chuyển status inactive
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
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete('/:id', requireRole('admin'), validateObjectId('id'), productController.deleteProduct);

/**
 * @swagger
 * /products/{id}/units:
 *   post:
 *     tags: [Product]
 *     summary: Thêm đơn vị quy đổi
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
 *             $ref: '#/components/schemas/ProductUnitCreateRequest'
 *     responses:
 *       201:
 *         description: Thêm thành công
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
 *                     unit: { $ref: '#/components/schemas/ProductUnit' }
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng tên đơn vị trong cùng sản phẩm (PRODUCT_UNIT_DUPLICATE_NAME)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/:id/units',
  requireRole('admin'),
  validateObjectId('id'),
  validate(createProductUnitSchema),
  productUnitController.addUnit,
);

/**
 * @swagger
 * /products/{id}/units/{unitId}:
 *   patch:
 *     tags: [Product]
 *     summary: Sửa đơn vị quy đổi (không cho sửa sellPrice của đơn vị cơ bản)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUnitUpdateRequest'
 *     responses:
 *       200:
 *         description: Sửa thành công (nếu sellPrice đổi, ghi PriceHistory changeType unit_price_edit)
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
 *                     unit: { $ref: '#/components/schemas/ProductUnit' }
 *       404:
 *         description: Không tìm thấy đơn vị quy đổi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng tên đơn vị (PRODUCT_UNIT_DUPLICATE_NAME)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Cố sửa sellPrice của đơn vị cơ bản (PRODUCT_UNIT_BASE_PRICE_READONLY)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id/units/:unitId',
  requireRole('admin'),
  validateObjectId('id', 'unitId'),
  validate(updateProductUnitSchema),
  productUnitController.updateUnit,
);

/**
 * @swagger
 * /products/{id}/units/{unitId}:
 *   delete:
 *     tags: [Product]
 *     summary: Xóa đơn vị quy đổi (chặn nếu isBaseUnit true)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy đơn vị quy đổi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       422:
 *         description: Không thể xóa đơn vị cơ bản (PRODUCT_UNIT_CANNOT_DELETE_BASE)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete(
  '/:id/units/:unitId',
  requireRole('admin'),
  validateObjectId('id', 'unitId'),
  productUnitController.deleteUnit,
);

export default router;
