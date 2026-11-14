import { Router } from 'express';

import { customerController } from '../controllers/customer.controller';
import { requireRole } from '../middlewares/requireRole.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import {
  bulkUpdateCustomerGroupSchema,
  createCustomerSchema,
  listCustomersQuerySchema,
  searchCustomersQuerySchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
} from '../validations/customer.validation';

const router = Router();

router.use(verifyToken);

// ⚠️ Route tĩnh (/search, /bulk-group) phải đăng ký TRƯỚC /:id, nếu không validateObjectId sẽ chặn nhầm

/**
 * @swagger
 * /customers:
 *   get:
 *     tags: [Customer]
 *     summary: Danh sách khách hàng — phân trang, tìm kiếm, lọc, sắp xếp
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
 *         description: Tìm theo tên hoặc SĐT (chứa từ khóa, không phân biệt hoa thường)
 *       - in: query
 *         name: customerGroup
 *         schema: { type: string, enum: [retail, wholesale, vip] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, blocked] }
 *       - in: query
 *         name: lastPurchaseFrom
 *         schema: { type: string, format: date-time, example: '2026-11-01T00:00:00+07:00' }
 *         description: ISO 8601 có múi giờ
 *       - in: query
 *         name: lastPurchaseTo
 *         schema: { type: string, format: date-time, example: '2026-11-30T23:59:59+07:00' }
 *         description: ISO 8601 có múi giờ
 *       - in: query
 *         name: minSpent
 *         schema: { type: number, minimum: 0 }
 *       - in: query
 *         name: maxSpent
 *         schema: { type: number, minimum: 0 }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: '-createdAt'
 *           enum: ['-createdAt', createdAt, name, '-name', totalSpent, '-totalSpent', lastPurchaseAt, '-lastPurchaseAt']
 *         description: Dấu "-" phía trước = giảm dần
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerListResponse'
 *       400:
 *         description: Query không hợp lệ (VALIDATION_FAILED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get(
  '/',
  validate(listCustomersQuerySchema, 'query'),
  customerController.listCustomers,
);

/**
 * @swagger
 * /customers/search:
 *   get:
 *     tags: [Customer]
 *     summary: Tìm nhanh khách hàng — panel F4 tại POS (chỉ khách active, không phân trang)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 2 }
 *         description: Toàn chữ số → khớp tiền tố SĐT (đã chuẩn hóa); ngược lại → tên chứa từ khóa
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 20, default: 10 }
 *     responses:
 *       200:
 *         description: Tìm thành công
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
 *                     customers:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CustomerSearchItem' }
 *       400:
 *         description: q thiếu hoặc ít hơn 2 ký tự (VALIDATION_FAILED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get(
  '/search',
  validate(searchCustomersQuerySchema, 'query'),
  customerController.searchCustomers,
);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     tags: [Customer]
 *     summary: Chi tiết khách hàng kèm giá trị đơn trung bình
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
 *                     customer: { $ref: '#/components/schemas/Customer' }
 *                     averageOrderValue: { type: number, description: 'round(totalSpent / orderCount), 0 nếu chưa có đơn' }
 *       404:
 *         description: Không tìm thấy khách hàng (CUSTOMER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/:id', validateObjectId('id'), customerController.getCustomerById);

/**
 * @swagger
 * /customers:
 *   post:
 *     tags: [Customer]
 *     summary: Tạo khách hàng (Admin và Thu ngân — dùng cả cho tạo nhanh ở panel F4)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerCreateRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ, VD SĐT sai định dạng (VALIDATION_FAILED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng số điện thoại sau chuẩn hóa (CUSTOMER_PHONE_ALREADY_EXISTS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/',
  validate(createCustomerSchema),
  customerController.createCustomer,
);

/**
 * @swagger
 * /customers/bulk-group:
 *   patch:
 *     tags: [Customer]
 *     summary: Đổi nhóm khách hàng hàng loạt (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerIds, customerGroup]
 *             properties:
 *               customerIds:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 500
 *                 items: { type: string }
 *               customerGroup: { type: string, enum: [retail, wholesale, vip] }
 *     responses:
 *       200:
 *         description: Đổi nhóm thành công — matchedCount < số id gửi lên nghĩa là có id không tồn tại
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
 *                     matchedCount: { type: integer }
 *                     modifiedCount: { type: integer }
 *       403:
 *         description: Không phải Admin (AUTH_FORBIDDEN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/bulk-group',
  requireRole('admin'),
  validate(bulkUpdateCustomerGroupSchema),
  customerController.bulkUpdateGroup,
);

/**
 * @swagger
 * /customers/{id}:
 *   patch:
 *     tags: [Customer]
 *     summary: Sửa thông tin khách hàng (Admin) — gửi field nào sửa field đó
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
 *             $ref: '#/components/schemas/CustomerUpdateRequest'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       403:
 *         description: Không phải Admin (AUTH_FORBIDDEN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Không tìm thấy khách hàng (CUSTOMER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Trùng số điện thoại (CUSTOMER_PHONE_ALREADY_EXISTS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id',
  requireRole('admin'),
  validateObjectId('id'),
  validate(updateCustomerSchema),
  customerController.updateCustomer,
);

/**
 * @swagger
 * /customers/{id}/status:
 *   patch:
 *     tags: [Customer]
 *     summary: Chuyển Active ↔ Blocked (Admin)
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, blocked] }
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 *       404:
 *         description: Không tìm thấy khách hàng (CUSTOMER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id/status',
  requireRole('admin'),
  validateObjectId('id'),
  validate(updateCustomerStatusSchema),
  customerController.updateCustomerStatus,
);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     tags: [Customer]
 *     summary: Xóa khách hàng (Admin) — xóa cứng nếu chưa có hóa đơn nào, ngược lại chuyển Blocked
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 'data.action = "deleted" (đã xóa cứng) hoặc "blocked" (kèm data.customer)'
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
 *                     action: { type: string, enum: [deleted, blocked] }
 *                     customer: { $ref: '#/components/schemas/Customer' }
 *       404:
 *         description: Không tìm thấy khách hàng (CUSTOMER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.delete(
  '/:id',
  requireRole('admin'),
  validateObjectId('id'),
  customerController.deleteCustomer,
);

export default router;
