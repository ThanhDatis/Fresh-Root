import { Schema, model } from 'mongoose';

import type { SequenceKey } from '../constants/order.constants';

export interface ICounter {
  _id: SequenceKey;
  seq: number;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

export const CounterModel = model<ICounter>('Counter', counterSchema);
