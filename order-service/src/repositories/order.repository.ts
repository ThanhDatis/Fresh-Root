import type {
  HydratedDocument,
  QueryFilter,
  Types,
  UpdateQuery,
} from 'mongoose';

import { OrderModel, type IOrder } from '../models/order.model';

export type OrderDocument = HydratedDocument<IOrder>;

async function create(data: Partial<IOrder>): Promise<OrderDocument> {
  return OrderModel.create(data);
}

async function findById(
  id: string | Types.ObjectId,
): Promise<OrderDocument | null> {
  return OrderModel.findById(id);
}

async function deleteById(id: string | Types.ObjectId): Promise<void> {
  await OrderModel.deleteOne({ _id: id });
}

async function existsByCustomerId(
  customerId: string | Types.ObjectId,
): Promise<boolean> {
  const found = await OrderModel.exists({ customerId });
  return found !== null;
}

// Update nguyên tử có điều kiện (chiếm quyền confirm/cancel...). LUÔN tăng __v: update kiểu này không đi qua save(),
// nếu không tăng __v thì save() của luồng Trả hàng (optimisticConcurrency) sẽ không phát hiện được thay đổi.
// Truyền field cần đổi trong $set, không đặt trực tiếp ở cấp ngoài cùng.
async function findOneAndUpdateVersioned(
  filter: QueryFilter<IOrder>,
  update: UpdateQuery<IOrder>,
): Promise<OrderDocument | null> {
  return OrderModel.findOneAndUpdate(
    filter,
    { ...update, $inc: { ...update.$inc, __v: 1 } },
    { new: true },
  );
}

export const orderRepository = {
  create,
  findById,
  deleteById,
  existsByCustomerId,
  findOneAndUpdateVersioned,
};
