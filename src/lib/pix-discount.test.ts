import { afterEach, describe, expect, it } from 'vitest';
import { applyPixDiscount, isPixDiscountEnabled } from './pix-discount';

const originalValue = process.env.PIX_DISCOUNT_ENABLED;

afterEach(() => {
    if (originalValue === undefined) delete process.env.PIX_DISCOUNT_ENABLED;
    else process.env.PIX_DISCOUNT_ENABLED = originalValue;
});

describe('pix discount', () => {
    it('is disabled by default', () => {
        delete process.env.PIX_DISCOUNT_ENABLED;
        expect(isPixDiscountEnabled()).toBe(false);
    });

    it('is enabled only when explicitly configured', () => {
        process.env.PIX_DISCOUNT_ENABLED = 'true';
        expect(isPixDiscountEnabled()).toBe(true);

        process.env.PIX_DISCOUNT_ENABLED = 'false';
        expect(isPixDiscountEnabled()).toBe(false);
    });

    it('applies the configured fixed rate with currency rounding', () => {
        expect(applyPixDiscount(100)).toBe(95);
        expect(applyPixDiscount(99.99)).toBe(94.99);
    });
});
