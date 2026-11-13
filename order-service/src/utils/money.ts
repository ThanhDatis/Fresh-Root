import { QUANTITY_DECIMALS } from '../constants/order.constants';

const QUANTITY_SCALE = 10 ** QUANTITY_DECIMALS;

// Đổi số lượng sang số nguyên (đơn vị 1/1000) để mọi phép nhân/chia tiền không dính sai số dấu phẩy động
function toScaledQuantity(quantity: number): number {
  return Math.round(quantity * QUANTITY_SCALE);
}

// 0.1 + 0.2 = 0.30000000000000004 → phải làm tròn sau mỗi lần cộng dồn số lượng
export function roundQuantity(quantity: number): number {
  return toScaledQuantity(quantity) / QUANTITY_SCALE;
}

export function hasValidQuantityPrecision(quantity: number): boolean {
  return Number.isFinite(quantity) && roundQuantity(quantity) === quantity;
}

// Thành tiền trước giảm giá: round(đơn giá × số lượng), tiền VNĐ luôn là số nguyên
export function calcGrossAmount(unitPrice: number, quantity: number): number {
  return Math.round((unitPrice * toScaledQuantity(quantity)) / QUANTITY_SCALE);
}

export function calcLineTotal(
  unitPrice: number,
  quantity: number,
  lineDiscount: number,
): number {
  return calcGrossAmount(unitPrice, quantity) - lineDiscount;
}

// Phân bổ giảm giá tổng hóa đơn vào từng dòng theo tỷ lệ lineTotal (phương pháp "phần dư lớn nhất"):
// mỗi dòng nhận phần nguyên, số đồng còn thiếu chia lần lượt cho các dòng có phần lẻ lớn nhất.
// Đảm bảo: tổng đúng bằng orderDiscount, không dòng nào âm, không dòng nào vượt lineTotal của nó.
// Dùng BigInt vì orderDiscount × lineTotal có thể vượt Number.MAX_SAFE_INTEGER.
export function allocateOrderDiscount(
  lineTotals: readonly number[],
  orderDiscount: number,
): number[] {
  const subtotal = lineTotals.reduce((sum, lineTotal) => sum + lineTotal, 0);

  if (orderDiscount < 0 || orderDiscount > subtotal) {
    throw new RangeError('orderDiscount phải nằm trong khoảng [0, subtotal]');
  }
  if (orderDiscount === 0) {
    return lineTotals.map(() => 0);
  }

  const discount = BigInt(orderDiscount);
  const total = BigInt(subtotal);

  const shares = lineTotals.map((lineTotal, index) => {
    const numerator = discount * BigInt(lineTotal);
    return {
      index,
      allocated: numerator / total,
      remainder: numerator % total,
    };
  });

  let remaining =
    discount - shares.reduce((sum, share) => sum + share.allocated, 0n);

  const byRemainderDesc = [...shares].sort((a, b) => {
    if (a.remainder !== b.remainder) {
      return a.remainder > b.remainder ? -1 : 1;
    }
    return a.index - b.index;
  });

  for (const share of byRemainderDesc) {
    if (remaining === 0n) {
      break;
    }
    share.allocated += 1n;
    remaining -= 1n;
  }

  return shares.map((share) => Number(share.allocated));
}

interface RefundableLine {
  quantity: number;
  returnedQuantity: number;
  finalLineTotal: number;
  refundedAmount: number;
}

// Tiền hoàn của một lần trả = (tiền hoàn lũy kế sau lần trả này) − (đã hoàn trước đó).
// Tính theo lũy kế thay vì từng lần riêng lẻ để làm tròn không cộng dồn sai:
// tổng các lần hoàn luôn = round(finalLineTotal × SL đã trả / SL dòng), trả hết dòng → đúng bằng finalLineTotal.
export function calcRefundAmount(
  line: RefundableLine,
  returnQuantity: number,
): number {
  const cumulativeQuantity = roundQuantity(
    line.returnedQuantity + returnQuantity,
  );

  if (returnQuantity <= 0 || cumulativeQuantity > line.quantity) {
    throw new RangeError('Số lượng trả không hợp lệ');
  }

  const cumulativeRefund = Math.round(
    (line.finalLineTotal * toScaledQuantity(cumulativeQuantity)) /
      toScaledQuantity(line.quantity),
  );

  return cumulativeRefund - line.refundedAmount;
}
