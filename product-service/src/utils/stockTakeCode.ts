import { STOCK_CODE_PAD_LENGTH, STOCK_CODE_PREFIX } from "../constants/product.constants";

export function generateNextStockTakeCode(lastStockTakeCode: string | undefined): string {
    const lastNumber = lastStockTakeCode
        ? parseInt(lastStockTakeCode.replace(STOCK_CODE_PREFIX, ''), 10)
        : 0;
    const nextNumber = (Number.isNaN(lastNumber) ? 0 : lastNumber) + 1;
    return `${STOCK_CODE_PREFIX}${String(nextNumber).padStart(STOCK_CODE_PAD_LENGTH, '0')}`;
}
