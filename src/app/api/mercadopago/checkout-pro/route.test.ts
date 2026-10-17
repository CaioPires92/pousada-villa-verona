import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';
import { POST } from './route';

vi.mock('@/lib/prisma', () => ({
    default: {
        booking: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        payment: {
            upsert: vi.fn(),
        },
        partialPaymentSettings: {
            findUnique: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}));

vi.mock('@/lib/ops-log', () => ({ opsLog: vi.fn() }));

const booking = {
    id: 'booking-1',
    status: 'PENDING',
    adults: 2,
    children: 0,
    checkIn: new Date('2026-12-29T00:00:00.000Z'),
    checkOut: new Date('2027-01-02T00:00:00.000Z'),
    totalPrice: 3796,
    guest: {
        name: 'Maria da Silva',
        email: 'maria@example.com',
        phone: '+55 (19) 99900-2288',
    },
    roomType: { id: 'room-1', name: 'Quarto Triplo' },
    payment: null,
};

function createRequest(body: Record<string, unknown>) {
    return new Request('https://www.villaveronapousada.com.br/api/mercadopago/checkout-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

describe('POST Mercado Pago hosted checkout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.MP_ACCESS_TOKEN = 'APP_USR-test';
        process.env.NEXT_PUBLIC_BASE_URL = 'https://www.villaveronapousada.com.br';
        process.env.ENABLE_TEST_PAYMENTS = 'false';
        delete process.env.MP_TEST_PAYER_EMAIL;
        (prisma.booking.findUnique as any).mockResolvedValue(booking);
        (prisma.partialPaymentSettings.findUnique as any).mockResolvedValue(null);
        (prisma.payment.upsert as any).mockResolvedValue({});
        (prisma.booking.update as any).mockResolvedValue({});
        (prisma.$transaction as any).mockResolvedValue([]);
    });

    it('creates a Checkout Pro preference and preserves webhook reconciliation data', async () => {
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
            ok: true,
            status: 201,
            json: async () => ({
                id: 'pref-123',
                init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123',
            }),
        }));
        vi.stubGlobal('fetch', fetchMock);

        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: ' MARIA@example.com ',
            paymentMode: 'FULL',
        }));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.initPoint).toContain('pref-123');
        const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
        const preference = JSON.parse(String(request.body));
        expect(preference).toMatchObject({
            external_reference: 'booking-1',
            notification_url: 'https://www.villaveronapousada.com.br/api/webhooks/mercadopago',
            payer: {
                email: 'maria@example.com',
                phone: { area_code: '19', number: '999002288' },
            },
            items: [{ unit_price: 3796, currency_id: 'BRL' }],
            payment_methods: {
                excluded_payment_types: [{ id: 'ticket' }],
                installments: 12,
            },
        });
        expect(preference.items[0].description).toContain('4 diária(s), 2026-12-29 a 2027-01-02');
        expect(preference).not.toHaveProperty('purpose');
        expect(prisma.payment.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { bookingId: 'booking-1' },
            create: expect.objectContaining({
                provider: 'MERCADOPAGO_CHECKOUT_PRO',
                providerId: 'pref-123',
                status: 'PENDING',
            }),
        }));
    });

    it('does not expose booking existence when guest email does not match', async () => {
        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: 'other@example.com',
        }));

        expect(response.status).toBe(404);
        expect(fetch).not.toHaveBeenCalled();
    });

    it('preserves a valid partial-payment plan for webhook confirmation', async () => {
        (prisma.partialPaymentSettings.findUnique as any).mockResolvedValue({
            enabled: true,
            percentage: 50,
            minimumBookingAmount: null,
            minimumLeadTimeDays: null,
            balanceDueAt: 'CHECK_IN',
            balanceDueDaysBeforeCheckIn: null,
            defaultPaymentMode: 'PARTIAL',
        });
        vi.stubGlobal('fetch', vi.fn(async () => ({
            ok: true,
            status: 201,
            json: async () => ({ id: 'pref-partial', init_point: 'https://mercadopago.test/partial' }),
        })));

        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: booking.guest.email,
            paymentMode: 'PARTIAL',
        }));

        expect(response.status).toBe(200);
        expect(prisma.payment.upsert).toHaveBeenCalledWith(expect.objectContaining({
            create: expect.objectContaining({
                amount: 1898,
                totalAmount: 3796,
                remainingAmount: 1898,
                paymentMode: 'PARTIAL',
                balanceDueAt: 'CHECK_IN',
            }),
        }));
    });

    it('allows hosted checkout for reservations below the former high-value threshold', async () => {
        (prisma.booking.findUnique as any).mockResolvedValue({ ...booking, totalPrice: 500 });
        vi.stubGlobal('fetch', vi.fn(async () => ({
            ok: true,
            status: 201,
            json: async () => ({ id: 'pref-standard', init_point: 'https://mercadopago.test/standard' }),
        })));

        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: booking.guest.email,
        }));

        expect(response.status).toBe(200);
        expect(await response.json()).toMatchObject({ initPoint: 'https://mercadopago.test/standard' });
    });

    it('does not send public callback options with a localhost URL', async () => {
        process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3005';
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
            ok: true,
            status: 201,
            json: async () => ({ id: 'pref-local', init_point: 'https://mercadopago.test/local' }),
        }));
        vi.stubGlobal('fetch', fetchMock);

        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: booking.guest.email,
        }));

        expect(response.status).toBe(200);
        const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
        const preference = JSON.parse(String(request.body));
        expect(preference).not.toHaveProperty('notification_url');
        expect(preference).not.toHaveProperty('back_urls');
        expect(preference).not.toHaveProperty('auto_return');
    });

    it('does not bind a real guest to a test Checkout Pro preference', async () => {
        process.env.ENABLE_TEST_PAYMENTS = 'true';
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
            ok: true,
            status: 201,
            json: async () => ({
                id: 'pref-test',
                init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-test',
                sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-test',
            }),
        }));
        vi.stubGlobal('fetch', fetchMock);

        const response = await POST(createRequest({
            bookingId: booking.id,
            guestEmail: booking.guest.email,
        }));

        expect(response.status).toBe(200);
        expect(await response.clone().json()).toMatchObject({
            initPoint: expect.stringContaining('www.mercadopago.com.br'),
        });
        const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
        const preference = JSON.parse(String(request.body));
        expect(preference).not.toHaveProperty('payer');
    });
});
