import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { normalizeBrazilianPhone } from '@/lib/mercadopago/payment-context';
import { requiresHostedMercadoPagoCheckout } from '@/lib/mercadopago/high-value-checkout';
import {
    DEFAULT_PARTIAL_PAYMENT_SETTINGS,
    calculatePaymentPlan,
    normalizePartialPaymentSettings,
    type PaymentMode,
} from '@/lib/partial-payment';
import { opsLog } from '@/lib/ops-log';

const PARTIAL_PAYMENT_SETTINGS_ID = 'default';

function getPublicBaseUrl(request: Request) {
    const configured = String(
        process.env.NEXT_PUBLIC_BASE_URL
        || process.env.NEXT_PUBLIC_APP_URL
        || ''
    ).trim().replace(/\/+$/, '');
    if (configured.startsWith('https://') || configured.startsWith('http://localhost')) return configured;

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    return host ? `${protocol}://${host}` : '';
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const bookingId = String(body?.bookingId || '').trim();
        const guestEmail = String(body?.guestEmail || '').trim().toLowerCase();
        const paymentMode: PaymentMode = body?.paymentMode === 'PARTIAL' ? 'PARTIAL' : 'FULL';

        if (!bookingId || !guestEmail) {
            return NextResponse.json({ error: 'BOOKING_IDENTIFICATION_REQUIRED' }, { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { roomType: true, guest: true, payment: true },
        });
        if (!booking || booking.guest.email.trim().toLowerCase() !== guestEmail) {
            return NextResponse.json({ error: 'BOOKING_NOT_FOUND' }, { status: 404 });
        }
        if (booking.status !== 'PENDING' || booking.payment?.status === 'APPROVED') {
            return NextResponse.json({ error: 'BOOKING_NOT_PAYABLE' }, { status: 409 });
        }

        const totalAmount = Number(booking.totalPrice);
        if (!requiresHostedMercadoPagoCheckout(totalAmount)) {
            return NextResponse.json({ error: 'HOSTED_CHECKOUT_NOT_REQUIRED' }, { status: 400 });
        }

        const settingsRow = await prisma.partialPaymentSettings.findUnique({
            where: { id: PARTIAL_PAYMENT_SETTINGS_ID },
        });
        const settings = normalizePartialPaymentSettings(settingsRow
            ? {
                  enabled: settingsRow.enabled,
                  percentage: settingsRow.percentage,
                  minimumBookingAmount: settingsRow.minimumBookingAmount === null
                      ? null
                      : Number(settingsRow.minimumBookingAmount),
                  minimumLeadTimeDays: settingsRow.minimumLeadTimeDays,
                  balanceDueAt: settingsRow.balanceDueAt === 'BEFORE_CHECK_IN' ? 'BEFORE_CHECK_IN' : 'CHECK_IN',
                  balanceDueDaysBeforeCheckIn: settingsRow.balanceDueDaysBeforeCheckIn,
                  defaultPaymentMode: settingsRow.defaultPaymentMode === 'PARTIAL' ? 'PARTIAL' : 'FULL',
              }
            : DEFAULT_PARTIAL_PAYMENT_SETTINGS);
        const paymentPlan = calculatePaymentPlan({
            settings,
            totalAmount,
            checkIn: booking.checkIn,
            paymentMode,
        });
        if (!paymentPlan.ok) {
            return NextResponse.json({ error: paymentPlan.error }, { status: 400 });
        }

        const accessToken = String(process.env.MP_ACCESS_TOKEN || '').trim();
        const publicBaseUrl = getPublicBaseUrl(request);
        if (!accessToken || !publicBaseUrl) {
            return NextResponse.json({ error: 'PAYMENT_CONFIGURATION_ERROR' }, { status: 500 });
        }

        const confirmationUrl = `${publicBaseUrl}/reservar/confirmacao/${booking.id}`;
        const payerPhone = normalizeBrazilianPhone(booking.guest.phone);
        const preference = {
            items: [{
                id: booking.roomType.id,
                title: `Pousada Villa Verona - ${booking.roomType.name}`.slice(0, 120),
                description: `${booking.adults} adulto(s), ${booking.children} criança(s)`,
                quantity: 1,
                unit_price: paymentPlan.amountDueNow,
                currency_id: 'BRL',
                category_id: 'travel',
            }],
            payer: {
                name: booking.guest.name,
                email: booking.guest.email,
                ...(payerPhone ? { phone: payerPhone } : {}),
            },
            back_urls: {
                success: confirmationUrl,
                failure: confirmationUrl,
                pending: confirmationUrl,
            },
            auto_return: 'approved',
            external_reference: booking.id,
            notification_url: `${publicBaseUrl}/api/webhooks/mercadopago`,
            statement_descriptor: 'VILLA VERONA',
            payment_methods: {
                excluded_payment_types: [{ id: 'ticket' }],
                installments: 12,
            },
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'X-Idempotency-Key': `hosted-checkout-${booking.id}-${paymentPlan.paymentMode}`,
            },
            body: JSON.stringify(preference),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.init_point) {
            opsLog('error', 'MP_HOSTED_CHECKOUT_CREATE_FAILED', {
                bookingId: booking.id,
                status: response.status,
                error: result?.error,
                message: result?.message,
            });
            return NextResponse.json({
                error: 'PAYMENT_LINK_CREATE_FAILED',
                message: 'Não foi possível abrir o ambiente de pagamento do Mercado Pago.',
            }, { status: response.ok ? 502 : response.status });
        }

        await prisma.$transaction([
            prisma.payment.upsert({
                where: { bookingId: booking.id },
                update: {
                    amount: paymentPlan.amountDueNow,
                    totalAmount,
                    remainingAmount: paymentPlan.remainingAmount,
                    paymentMode: paymentPlan.paymentMode,
                    balanceDueAt: paymentPlan.balanceDueAt,
                    balanceDueDate: paymentPlan.balanceDueDate,
                    status: 'PENDING',
                    provider: 'MERCADOPAGO_CHECKOUT_PRO',
                    providerId: String(result.id || ''),
                    method: null,
                    cardBrand: null,
                    installments: null,
                },
                create: {
                    bookingId: booking.id,
                    amount: paymentPlan.amountDueNow,
                    totalAmount,
                    remainingAmount: paymentPlan.remainingAmount,
                    paymentMode: paymentPlan.paymentMode,
                    balanceDueAt: paymentPlan.balanceDueAt,
                    balanceDueDate: paymentPlan.balanceDueDate,
                    status: 'PENDING',
                    provider: 'MERCADOPAGO_CHECKOUT_PRO',
                    providerId: String(result.id || ''),
                },
            }),
            prisma.booking.update({
                where: { id: booking.id },
                data: {
                    funnelStage: 'PAYMENT_PENDING',
                    funnelUpdatedAt: new Date(),
                    lastErrorMessage: null,
                },
            }),
        ]);

        return NextResponse.json({ initPoint: result.init_point });
    } catch (error) {
        opsLog('error', 'MP_HOSTED_CHECKOUT_UNEXPECTED_ERROR', {
            message: error instanceof Error ? error.message : String(error),
        });
        return NextResponse.json({
            error: 'PAYMENT_LINK_UNEXPECTED_ERROR',
            message: 'Não foi possível abrir o ambiente de pagamento do Mercado Pago.',
        }, { status: 500 });
    }
}
