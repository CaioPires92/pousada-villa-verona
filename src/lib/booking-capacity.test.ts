import { describe, expect, it } from 'vitest';
import { MAX_BOOKING_GUESTS } from './booking-capacity';

describe('booking capacity', () => {
    it('supports the five-guest room category', () => {
        expect(MAX_BOOKING_GUESTS).toBe(5);
    });
});
