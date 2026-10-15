import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdminAuth, syncHospedinAvailability, findUnique, updateMany } = vi.hoisted(() => ({
    requireAdminAuth: vi.fn(),
    syncHospedinAvailability: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(),
}));

vi.mock('@/lib/admin-auth', () => ({ requireAdminAuth }));
vi.mock('@/lib/hospedin-sync', () => ({ syncHospedinAvailability }));
vi.mock('@/lib/prisma', () => ({ default: { booking: { findUnique, updateMany } } }));

import { POST } from './route';

describe('POST /api/admin/bookings/[bookingId]/hospedin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        requireAdminAuth.mockResolvedValue({ ok: true });
        findUnique.mockResolvedValue({
            id: 'booking-1',
            status: 'CONFIRMED',
            roomTypeId: 'room-1',
            checkIn: new Date('2026-10-15T00:00:00.000Z'),
            checkOut: new Date('2026-10-16T00:00:00.000Z'),
            hospedinRegisteredAt: null,
        });
        syncHospedinAvailability.mockResolvedValue({
            results: [{ roomName: 'Quarto Triplo', daysSynced: 2 }],
        });
        updateMany.mockResolvedValue({ count: 1 });
    });

    it('sincroniza antes de marcar a reserva como lançada', async () => {
        const response = await POST(
            new Request('http://localhost/api/admin/bookings/booking-1/hospedin', {
                method: 'POST',
                body: JSON.stringify({ hospedinReservationId: 'HSP-123' }),
            }),
            { params: Promise.resolve({ bookingId: 'booking-1' }) }
        );

        expect(response.status).toBe(200);
        expect(syncHospedinAvailability).toHaveBeenCalledWith({
            beginDate: '2026-10-15',
            endDate: '2026-10-16',
            roomTypeId: 'room-1',
        });
        expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'booking-1', hospedinRegisteredAt: null },
            data: expect.objectContaining({ hospedinReservationId: 'HSP-123' }),
        }));
        expect(syncHospedinAvailability.mock.invocationCallOrder[0]).toBeLessThan(updateMany.mock.invocationCallOrder[0]);
    });

    it('não marca quando a sincronização falha', async () => {
        syncHospedinAvailability.mockResolvedValue({
            results: [{ roomName: 'Quarto Triplo', error: 'Falha na API' }],
        });

        const response = await POST(
            new Request('http://localhost/api/admin/bookings/booking-1/hospedin', { method: 'POST' }),
            { params: Promise.resolve({ bookingId: 'booking-1' }) }
        );

        expect(response.status).toBe(502);
        expect(updateMany).not.toHaveBeenCalled();
    });
});
