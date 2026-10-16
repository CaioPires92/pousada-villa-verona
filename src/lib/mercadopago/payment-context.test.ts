import { describe, expect, it } from 'vitest';

import {
    buildMercadoPagoPaymentContext,
    getPolledBookingPaymentStatus,
    getPaymentRejectionMessage,
    isRetryablePaymentRejection,
    normalizeBrazilianPhone,
} from './payment-context';

describe('Mercado Pago payment context', () => {
    it('normalizes a Brazilian phone with country code', () => {
        expect(normalizeBrazilianPhone('+55 (19) 99900-2288')).toEqual({
            area_code: '19',
            number: '999002288',
        });
    });

    it('builds payer and lodging item details from trusted booking data', () => {
        const context = buildMercadoPagoPaymentContext({
            bookingId: 'booking-1',
            roomTypeId: 'room-1',
            roomName: 'Quarto Triplo',
            checkIn: new Date('2026-11-10T00:00:00.000Z'),
            checkOut: new Date('2026-11-13T00:00:00.000Z'),
            adults: 2,
            children: 1,
            amount: 2928.18,
            guestName: 'Maria da Silva',
            guestPhone: '19999002288',
            ipAddress: '203.0.113.10',
        });

        expect(context.payerPhone).toEqual({ area_code: '19', number: '999002288' });
        expect(context.additionalInfo).toMatchObject({
            ip_address: '203.0.113.10',
            payer: { first_name: 'Maria', last_name: 'da Silva' },
            items: [{
                id: 'room-1',
                title: 'Hospedagem - Quarto Triplo',
                quantity: 1,
                unit_price: 2928.18,
            }],
        });
        expect(context.additionalInfo.items[0]).not.toHaveProperty('currency_id');
        expect(context.additionalInfo.items[0].description).toContain('3 diária(s)');
    });

    it('returns actionable rejection guidance', () => {
        expect(getPaymentRejectionMessage('cc_rejected_high_risk')).toContain('análise de segurança');
        expect(getPaymentRejectionMessage('cc_rejected_invalid_installments')).toContain('menos parcelas');
    });

    it('keeps only rejected payments eligible for another attempt', () => {
        expect(isRetryablePaymentRejection('rejected')).toBe(true);
        expect(isRetryablePaymentRejection('cancelled')).toBe(false);
        expect(isRetryablePaymentRejection('refunded')).toBe(false);
        expect(isRetryablePaymentRejection('charged_back')).toBe(false);
    });

    it('detects a rejected payment while its booking remains pending', () => {
        expect(getPolledBookingPaymentStatus({
            bookingStatus: 'PENDING',
            paymentStatus: 'REJECTED',
        })).toBe('REJECTED');
        expect(getPolledBookingPaymentStatus({
            bookingStatus: 'PENDING',
            paymentStatus: 'PENDING',
        })).toBe('PENDING');
    });
});
