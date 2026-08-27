import { Router } from 'express';

import { employeeAdminController } from '../../controllers/admin/employeeAdmin.controller';
import { requireRole } from '../../middlewares/requireRole.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { verifyToken } from '../../middlewares/verifyToken.middleware';
import {
  createEmployeeSchema,
  employeeIdParamSchema,
  listEmployeesQuerySchema,
  updateEmployeeSchema,
  updateEmploymentStatusSchema,
} from '../../validations/employeeAdmin.validation';

const router = Router();

router.use(verifyToken, requireRole('admin'));

/**
 * @swagger
 * /admin/employees:
 *   get:
 *     tags: [Employee Admin]
 *     summary: Danh sách nhân viên — phân trang, tìm kiếm, lọc
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
 *         description: Tìm theo fullName, username, employeeCode
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [admin, cashier] }
 *       - in: query
 *         name: employmentStatus
 *         schema: { type: string, enum: [active, resigned] }
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeListResponse'
 *       403:
 *         description: Không có quyền (không phải Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get(
  '/',
  validate(listEmployeesQuerySchema, 'query'),
  employeeAdminController.listEmployees,
);

/**
 * @swagger
 * /admin/employees:
 *   post:
 *     tags: [Employee Admin]
 *     summary: Tạo tài khoản Nhân viên mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       409:
 *         description: Username đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/',
  validate(createEmployeeSchema),
  employeeAdminController.createEmployee,
);

/**
 * @swagger
 * /admin/employees/{id}:
 *   get:
 *     tags: [Employee Admin]
 *     summary: Chi tiết nhân viên
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Không tìm thấy nhân viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get(
  '/:id',
  validate(employeeIdParamSchema, 'params'),
  employeeAdminController.getEmployeeById,
);

/**
 * @swagger
 * /admin/employees/{id}:
 *   patch:
 *     tags: [Employee Admin]
 *     summary: Sửa thông tin/vai trò nhân viên (không đổi được username)
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
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *     responses:
 *       200:
 *         description: Sửa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Không tìm thấy nhân viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id',
  validate(employeeIdParamSchema, 'params'),
  validate(updateEmployeeSchema),
  employeeAdminController.updateEmployee,
);

/**
 * @swagger
 * /admin/employees/{id}/status:
 *   patch:
 *     tags: [Employee Admin]
 *     summary: Chuyển trạng thái "Đã nghỉ việc" / kích hoạt lại
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
 *             $ref: '#/components/schemas/UpdateEmploymentStatusRequest'
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeResponse'
 *       404:
 *         description: Không tìm thấy nhân viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/:id/status',
  validate(employeeIdParamSchema, 'params'),
  validate(updateEmploymentStatusSchema),
  employeeAdminController.updateEmploymentStatus,
);

export default router;
