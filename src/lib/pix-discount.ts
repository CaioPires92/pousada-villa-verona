export const PIX_DISCOUNT_RATE = 0.05;

export function isPixDiscountEnabled() {
    return String(process.env.PIX_DISCOUNT_ENABLED || '').trim().toLowerCase() === 'true';
}

export function applyPixDiscount(amount: number) {
    return Number((amount * (1 - PIX_DISCOUNT_RATE)).toFixed(2));
}
