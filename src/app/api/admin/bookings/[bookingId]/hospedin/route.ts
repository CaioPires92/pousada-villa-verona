import { NextResponse } from 'next/server';

import { requireAdminAuth } from '@/lib/admin-auth';
import { syncHospedinAvailability } from '@/lib/hospedin-sync';
import prisma from '@/lib/prisma';
import { asNullableString } from '@/lib/requestValue';

type RouteContext = { params: Promise<{ bookingId: string }> };

export async function POST(request: Request, context: RouteContext) {
    const auth = await requireAdminAuth();
    if (auth instanceof Response) return auth;

    const { bookingId } = await context.params;
    const normalizedBookingId = asNullableString(bookingId);
    if (!normalizedBookingId) {
        return NextResponse.json({ error: 'BOOKING_ID_REQUIRED', message: 'Reserva inválida.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const hospedinReservationId = asNullableString(body?.hospedinReservationId);
    if (hospedinReservationId && hospedinReservationId.length > 100) {
        return NextResponse.json({ error: 'INVALID_HOSPEDIN_ID', message: 'O código do Hospedin é muito longo.' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
        where: { id: normalizedBookingId },
        select: {
            id: true,
            status: true,
            roomTypeId: true,
            checkIn: true,
            checkOut: true,
            hospedinRegisteredAt: true,
        },
    });

    if (!booking) {
        return NextResponse.json({ error: 'BOOKING_NOT_FOUND', message: 'Reserva não encontrada.' }, { status: 404 });
    }

    if (!['CONFIRMED', 'PAID'].includes(String(booking.status).toUpperCase())) {
        return NextResponse.json({
            error: 'BOOKING_NOT_CONFIRMED',
            message: 'Somente reservas confirmadas ou pagas podem ser lançadas no Hospedin.',
        }, { status: 409 });
    }

    if (booking.hospedinRegisteredAt) {
        return NextResponse.json({
            ok: true,
            alreadyRegistered: true,
            hospedinRegisteredAt: booking.hospedinRegisteredAt,
        });
    }

    const beginDate = booking.checkIn.toISOString().slice(0, 10);
    const endDate = booking.checkOut.toISOString().slice(0, 10);
    let sync;
    try {
        sync = await syncHospedinAvailability({ beginDate, endDate, roomTypeId: booking.roomTypeId });
    } catch (error) {
        return NextResponse.json({
            error: 'HOSPEDIN_SYNC_FAILED',
            message: `A reserva não foi marcada porque a sincronização falhou: ${error instanceof Error ? error.message : 'erro desconhecido'}`,
        }, { status: 502 });
    }
    const failedResult = sync.results.find((result) => 'error' in result);
    const successfulResult = sync.results.find(
        (result) => 'daysSynced' in result && Number(result.daysSynced) > 0
    );

    if (failedResult || !successfulResult) {
        const details = failedResult && 'error' in failedResult ? failedResult.error : 'Nenhum dia retornado pelo Hospedin.';
        return NextResponse.json({
            error: 'HOSPEDIN_SYNC_FAILED',
            message: `A reserva não foi marcada porque a sincronização falhou: ${details}`,
        }, { status: 502 });
    }

    const registeredAt = new Date();
    const result = await prisma.booking.updateMany({
        where: { id: booking.id, hospedinRegisteredAt: null },
        data: {
            hospedinReservationId: hospedinReservationId || null,
            hospedinRegisteredAt: registeredAt,
        },
    });

    return NextResponse.json({
        ok: true,
        alreadyRegistered: result.count === 0,
        hospedinReservationId: hospedinReservationId || null,
        hospedinRegisteredAt: registeredAt,
        sync: sync.results,
    });
}
