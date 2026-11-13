import { describe, expect, it } from 'vitest';

import {
  allocateOrderDiscount,
  calcGrossAmount,
  calcLineTotal,
  calcRefundAmount,
  hasValidQuantityPrecision,
  roundQuantity,
} from './money';

const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

describe('roundQuantity', () => {
  it('khử sai số dấu phẩy động khi cộng dồn', () => {
    expect(roundQuantity(0.1 + 0.2)).toBe(0.3);
  });

  it('làm tròn tối đa 3 chữ số thập phân', () => {
    expect(roundQuantity(1.23456)).toBe(1.235);
  });
});

describe('hasValidQuantityPrecision', () => {
  it('chấp nhận tối đa 3 chữ số thập phân', () => {
    expect(hasValidQuantityPrecision(2)).toBe(true);
    expect(hasValidQuantityPrecision(1.25)).toBe(true);
    expect(hasValidQuantityPrecision(0.125)).toBe(true);
  });

  it('từ chối quá 3 chữ số thập phân hoặc không phải số hữu hạn', () => {
    expect(hasValidQuantityPrecision(1.2345)).toBe(false);
    expect(hasValidQuantityPrecision(Number.NaN)).toBe(false);
    expect(hasValidQuantityPrecision(Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe('calcGrossAmount / calcLineTotal', () => {
  it('nhân đơn giá với số lượng nguyên', () => {
    expect(calcGrossAmount(15000, 2)).toBe(30000);
  });

  it('nhân với số lượng thập phân và làm tròn về VNĐ nguyên', () => {
    expect(calcGrossAmount(12500, 0.5)).toBe(6250);
    expect(calcGrossAmount(9999, 1.005)).toBe(10049);
    expect(calcGrossAmount(3, 0.5)).toBe(2);
  });

  it('trừ giảm giá dòng', () => {
    expect(calcLineTotal(15000, 2, 5000)).toBe(25000);
  });
});

describe('allocateOrderDiscount', () => {
  it('chia đúng tỷ lệ khi chia hết', () => {
    expect(allocateOrderDiscount([100000, 50000, 50000], 20000)).toEqual([
      10000, 5000, 5000,
    ]);
  });

  it('số đồng lẻ được chia cho các dòng có phần dư lớn nhất, tổng luôn đúng', () => {
    expect(allocateOrderDiscount([1, 1, 1], 2)).toEqual([1, 1, 0]);
  });

  it('không dòng nào âm hay vượt lineTotal (trường hợp "dòng cuối nhận phần dư" bị sai)', () => {
    const allocated = allocateOrderDiscount([3, 3, 0], 5);
    expect(allocated).toEqual([3, 2, 0]);
    expect(sum(allocated)).toBe(5);
  });

  it('giảm toàn bộ hóa đơn → mỗi dòng giảm đúng bằng lineTotal', () => {
    expect(allocateOrderDiscount([10, 20], 30)).toEqual([10, 20]);
  });

  it('trả toàn 0 khi không có giảm giá', () => {
    expect(allocateOrderDiscount([10, 20], 0)).toEqual([0, 0]);
  });

  it('xử lý số lớn vượt Number.MAX_SAFE_INTEGER khi nhân', () => {
    expect(allocateOrderDiscount([900000000, 900000000], 120000000)).toEqual([
      60000000, 60000000,
    ]);
  });

  it('nhiều tổ hợp: tổng = orderDiscount, mỗi dòng trong [0, lineTotal]', () => {
    const cases: Array<[number[], number]> = [
      [[33333, 33333, 33334], 10000],
      [[7, 11, 13, 17], 23],
      [[1, 2, 3, 4, 5], 7],
      [[50000], 12345],
      [[0, 0, 10], 9],
    ];
    for (const [lineTotals, orderDiscount] of cases) {
      const allocated = allocateOrderDiscount(lineTotals, orderDiscount);
      expect(sum(allocated)).toBe(orderDiscount);
      allocated.forEach((value, index) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(lineTotals[index] ?? 0);
      });
    }
  });

  it('báo lỗi khi orderDiscount âm hoặc lớn hơn subtotal', () => {
    expect(() => allocateOrderDiscount([10, 20], -1)).toThrow(RangeError);
    expect(() => allocateOrderDiscount([10, 20], 31)).toThrow(RangeError);
  });
});

describe('calcRefundAmount', () => {
  // Mô phỏng trả lần lượt từng phần, cập nhật returnedQuantity/refundedAmount như service sẽ làm
  function returnInSteps(
    quantity: number,
    finalLineTotal: number,
    steps: number[],
  ): number[] {
    let returnedQuantity = 0;
    let refundedAmount = 0;
    return steps.map((returnQuantity) => {
      const refund = calcRefundAmount(
        { quantity, returnedQuantity, finalLineTotal, refundedAmount },
        returnQuantity,
      );
      returnedQuantity = roundQuantity(returnedQuantity + returnQuantity);
      refundedAmount += refund;
      return refund;
    });
  }

  it('trả từng phần: tổng tiền hoàn đúng bằng finalLineTotal', () => {
    const refunds = returnInSteps(3, 100, [1, 1, 1]);
    expect(refunds).toEqual([33, 34, 33]);
    expect(sum(refunds)).toBe(100);
  });

  it('làm tròn không cộng dồn vượt số khách đã trả', () => {
    const refunds = returnInSteps(6, 3, [1, 1, 1, 1, 1, 1]);
    expect(sum(refunds)).toBe(3);
    refunds.forEach((refund) => expect(refund).toBeGreaterThanOrEqual(0));
  });

  it('số lượng thập phân', () => {
    expect(returnInSteps(1.5, 45000, [0.5, 1])).toEqual([15000, 30000]);
  });

  it('cộng dồn 0.1 ba lần vẫn được coi là trả hết 0.3', () => {
    const refunds = returnInSteps(0.3, 100, [0.1, 0.1, 0.1]);
    expect(sum(refunds)).toBe(100);
  });

  it('báo lỗi khi trả vượt số còn lại hoặc số lượng <= 0', () => {
    const line = {
      quantity: 1,
      returnedQuantity: 1,
      finalLineTotal: 100,
      refundedAmount: 100,
    };
    expect(() => calcRefundAmount(line, 0.5)).toThrow(RangeError);
    expect(() =>
      calcRefundAmount({ ...line, returnedQuantity: 0, refundedAmount: 0 }, 0),
    ).toThrow(RangeError);
  });
});
