export function toBaseQuantity(
    quantity: number,
    conversionRate: number
): number {
    return quantity * conversionRate;
}
