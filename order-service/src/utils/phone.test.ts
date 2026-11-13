import { describe, expect, it } from 'vitest';

import { isValidPhone, normalizePhone } from './phone';

describe('normalizePhone', () => {
  it.each([
    ['+84 912 345 678', '0912345678'],
    ['84912345678', '0912345678'],
    ['0912.345.678', '0912345678'],
    ['(091) 234-5678', '0912345678'],
    ['  0912345678  ', '0912345678'],
  ])('%s → %s', (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });

  it('không đổi số bắt đầu bằng 0 có chứa "84" phía sau', () => {
    expect(normalizePhone('0845123456')).toBe('0845123456');
  });

  it('không tự xóa ký tự lạ — để validate bắt lỗi', () => {
    expect(normalizePhone('091234567a')).toBe('091234567a');
  });
});

describe('isValidPhone', () => {
  it('chấp nhận 10 chữ số bắt đầu bằng 0', () => {
    expect(isValidPhone('0912345678')).toBe(true);
  });

  it.each(['091234567', '09123456789', '091234567a', '1912345678', ''])(
    'từ chối "%s"',
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    },
  );
});
