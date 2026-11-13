import type { SequenceKey } from '../constants/order.constants';
import { CounterModel } from '../models/counter.model';

// $inc nguyên tử + upsert: nhiều request đồng thời luôn nhận số khác nhau, không cần "đọc bản ghi cuối + 1"
async function increment(key: SequenceKey): Promise<number> {
  const counter = await CounterModel.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  );
  if (!counter) {
    throw new Error(`Không tạo được bộ đếm "${key}"`);
  }
  return counter.seq;
}

export const counterRepository = {
  increment,
};
