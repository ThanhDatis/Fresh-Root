import { randomBytes, createHash } from 'crypto';

import { RESET_TOKEN_BYTE_LENGTH } from '../constants/auth.constants';

export function generateRawResetToken(): string {
  return randomBytes(RESET_TOKEN_BYTE_LENGTH).toString('hex');
}

export function hashResetToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}
