import { PRODUCT_CODE_PAD_LENGTH, PRODUCT_CODE_PREFIX } from "../constants/product.constants";

export function generateNextProductCode(
    lastProductCode: string | undefined
): string {
    const lastNumber = lastProductCode
        ? parseInt(lastProductCode.replace(PRODUCT_CODE_PREFIX, ''), 10)
        : 0;
    const nextNumber = (Number.isNaN(lastNumber) ? 0 : lastNumber) + 1;
    return `${PRODUCT_CODE_PREFIX}${String(nextNumber).padStart(PRODUCT_CODE_PAD_LENGTH, '0')}`;
}
