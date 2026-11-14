import type { Request, Response } from 'express';

import { customerService } from '../services/customer.service';
import { sendPaginated, sendSuccess } from '../utils/apiResponse';
import type {
  BulkUpdateCustomerGroupInput,
  CreateCustomerInput,
  ListCustomersQuery,
  SearchCustomersQuery,
  UpdateCustomerInput,
  UpdateCustomerStatusInput,
} from '../validations/customer.validation';

async function createCustomer(req: Request, res: Response): Promise<void> {
  const customer = await customerService.createCustomer(
    req.body as CreateCustomerInput,
  );
  sendSuccess(res, 201, 'Tạo khách hàng thành công', { customer });
}

async function listCustomers(req: Request, res: Response): Promise<void> {
  const { items, pagination } = await customerService.listCustomers(
    req.query as unknown as ListCustomersQuery,
  );
  sendPaginated(res, 'Lấy danh sách khách hàng thành công', items, pagination);
}

async function searchCustomers(req: Request, res: Response): Promise<void> {
  const customers = await customerService.searchCustomers(
    req.query as unknown as SearchCustomersQuery,
  );
  sendSuccess(res, 200, 'Tìm khách hàng thành công', { customers });
}

async function getCustomerById(req: Request, res: Response): Promise<void> {
  const result = await customerService.getCustomerById(req.params.id as string);
  sendSuccess(res, 200, 'Lấy chi tiết khách hàng thành công', result);
}

async function updateCustomer(req: Request, res: Response): Promise<void> {
  const customer = await customerService.updateCustomer(
    req.params.id as string,
    req.body as UpdateCustomerInput,
  );
  sendSuccess(res, 200, 'Cập nhật khách hàng thành công', { customer });
}

async function updateCustomerStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const { status } = req.body as UpdateCustomerStatusInput;
  const customer = await customerService.updateCustomerStatus(
    req.params.id as string,
    status,
  );
  sendSuccess(res, 200, 'Cập nhật trạng thái khách hàng thành công', {
    customer,
  });
}

async function deleteCustomer(req: Request, res: Response): Promise<void> {
  const result = await customerService.deleteCustomer(req.params.id as string);
  const message =
    result.action === 'deleted'
      ? 'Xóa khách hàng thành công'
      : 'Khách hàng đã có hóa đơn nên được chuyển sang trạng thái Blocked thay vì xóa';
  sendSuccess(res, 200, message, result);
}

async function bulkUpdateGroup(req: Request, res: Response): Promise<void> {
  const result = await customerService.bulkUpdateGroup(
    req.body as BulkUpdateCustomerGroupInput,
  );
  sendSuccess(res, 200, 'Đổi nhóm khách hàng hàng loạt thành công', result);
}

export const customerController = {
  createCustomer,
  listCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  bulkUpdateGroup,
};
