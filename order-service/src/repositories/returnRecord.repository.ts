import type { HydratedDocument, Types } from 'mongoose';

import {
  ReturnRecordModel,
  type IReturnRecord,
} from '../models/returnRecord.model';

export type ReturnRecordDocument = HydratedDocument<IReturnRecord>;

async function create(
  data: Partial<IReturnRecord>,
): Promise<ReturnRecordDocument> {
  return ReturnRecordModel.create(data);
}

async function findByRequestId(
  requestId: string,
): Promise<ReturnRecordDocument | null> {
  return ReturnRecordModel.findOne({ requestId });
}

async function findByOrderId(
  orderId: string | Types.ObjectId,
): Promise<ReturnRecordDocument[]> {
  return ReturnRecordModel.find({ orderId }).sort({ createdAt: -1 });
}

export const returnRecordRepository = {
  create,
  findByRequestId,
  findByOrderId,
};
