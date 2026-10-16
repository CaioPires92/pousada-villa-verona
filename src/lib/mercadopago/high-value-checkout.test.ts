import { describe, expect, it } from 'vitest';

import {
    HIGH_VALUE_CHECKOUT_THRESHOLD,
    requiresHostedMercadoPagoCheckout,
} from './high-value-checkout';

describe('high-value Mercado Pago checkout', () => {
    it('routes reservations at or above the threshold to hosted checkout', () => {
        expect(requiresHostedMercadoPagoCheckout(HIGH_VALUE_CHECKOUT_THRESHOLD - 0.01)).toBe(false);
        expect(requiresHostedMercadoPagoCheckout(HIGH_VALUE_CHECKOUT_THRESHOLD)).toBe(true);
        expect(requiresHostedMercadoPagoCheckout(3796)).toBe(true);
    });
});
