import type { Request, Response } from 'express';

import { employeeAdminService } from '../../services/employeeAdmin.service';
import { sendPaginated, sendSuccess } from '../../utils/apiResponse';
import type {
  CreateEmployeeInput,
  ListEmployeesQuery,
  UpdateEmployeeInput,
  UpdateEmploymentStatusInput,
} from '../../validations/employeeAdmin.validation';

async function createEmployee(req: Request, res: Response): Promise<void> {
  const employee = await employeeAdminService.createEmployee(
    req.body as CreateEmployeeInput,
  );
  sendSuccess(res, 201, 'Tạo nhân viên thành công', { employee });
}

async function listEmployees(req: Request, res: Response): Promise<void> {
  const { items, pagination } = await employeeAdminService.listEmployees(
    req.query as unknown as ListEmployeesQuery,
  );
  sendPaginated(res, 'Lấy danh sách nhân viên thành công', items, pagination);
}

async function getEmployeeById(req: Request, res: Response): Promise<void> {
  const employee = await employeeAdminService.getEmployeeById(
    req.params.id as string,
  );
  sendSuccess(res, 200, 'Lấy thông tin nhân viên thành công', { employee });
}

async function updateEmployee(req: Request, res: Response): Promise<void> {
  const employee = await employeeAdminService.updateEmployee(
    req.params.id as string,
    req.body as UpdateEmployeeInput,
  );
  sendSuccess(res, 200, 'Cập nhật nhân viên thành công', { employee });
}

async function updateEmploymentStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const employee = await employeeAdminService.updateEmploymentStatus(
    req.params.id as string,
    req.body as UpdateEmploymentStatusInput,
  );
  sendSuccess(res, 200, 'Cập nhật trạng thái nhân viên thành công', {
    employee,
  });
}

export const employeeAdminController = {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmploymentStatus,
};
