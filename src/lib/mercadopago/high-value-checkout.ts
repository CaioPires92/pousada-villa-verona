export const HIGH_VALUE_CHECKOUT_THRESHOLD = 2500;

export function requiresHostedMercadoPagoCheckout(totalAmount: unknown) {
    const amount = Number(totalAmount);
    return Number.isFinite(amount) && amount >= HIGH_VALUE_CHECKOUT_THRESHOLD;
}
