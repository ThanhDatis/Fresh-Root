import type { HydratedDocument, Types } from 'mongoose';

import { CustomerModel, type ICustomer } from '../models/customer.model';

export type CustomerDocument = HydratedDocument<ICustomer>;

async function create(data: Partial<ICustomer>): Promise<CustomerDocument> {
  return CustomerModel.create(data);
}

async function findById(
  id: string | Types.ObjectId,
): Promise<CustomerDocument | null> {
  return CustomerModel.findById(id);
}

async function findByPhone(phone: string): Promise<CustomerDocument | null> {
  return CustomerModel.findOne({ phone });
}

async function findByCustomerCode(
  customerCode: string,
): Promise<CustomerDocument | null> {
  return CustomerModel.findOne({ customerCode });
}

async function updateById(
  id: string | Types.ObjectId,
  update: Partial<ICustomer>,
): Promise<CustomerDocument | null> {
  return CustomerModel.findByIdAndUpdate(id, update, { new: true });
}

async function deleteById(id: string | Types.ObjectId): Promise<void> {
  await CustomerModel.deleteOne({ _id: id });
}

export const customerRepository = {
  create,
  findById,
  findByPhone,
  findByCustomerCode,
  updateById,
  deleteById,
};
