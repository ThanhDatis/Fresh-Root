import {
  CODE_PAD_LENGTH,
  CODE_PREFIXES,
  type SequenceKey,
} from '../constants/order.constants';
import { counterRepository } from '../repositories/counter.repository';

export function formatCode(key: SequenceKey, seq: number): string {
  return `${CODE_PREFIXES[key]}${String(seq).padStart(CODE_PAD_LENGTH, '0')}`;
}

export async function generateCode(key: SequenceKey): Promise<string> {
  const seq = await counterRepository.increment(key);
  return formatCode(key, seq);
}
