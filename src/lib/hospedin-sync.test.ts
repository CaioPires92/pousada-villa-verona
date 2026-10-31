import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';
import { hospedinClient } from '@/lib/hospedin';
import { syncHospedinAvailability } from './hospedin-sync';

vi.mock('@/lib/prisma', () => ({
  default: {
    roomType: { findMany: vi.fn() },
    inventoryAdjustment: { findMany: vi.fn(), upsert: vi.fn() },
    rate: { upsert: vi.fn() },
  },
}));

vi.mock('@/lib/hospedin', () => ({
  hospedinClient: { getAvailability: vi.fn() },
}));

describe('syncHospedinAvailability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.roomType.findMany as any).mockResolvedValue([
      { id: 'room-1', name: 'Quarto', totalUnits: 6, externalId: 'hospedin-1' },
    ]);
    (prisma.inventoryAdjustment.findMany as any).mockResolvedValue([]);
    (prisma.inventoryAdjustment.upsert as any).mockResolvedValue({});
    (hospedinClient.getAvailability as any).mockResolvedValue([
      { date: '2026-11-01', availability: 6, rate_price: 0 },
    ]);
  });

  it('stores raw Hospedin inventory and publishes one fewer unit', async () => {
    await syncHospedinAvailability({ beginDate: '2026-11-01', endDate: '2026-11-01' });

    expect(prisma.inventoryAdjustment.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({
        hospedinUnits: 6,
        manualOverrideUnits: null,
        totalUnits: 5,
        occupiedUnits: 0,
      }),
    }));
  });

  it('clears an existing manual override when synchronization is confirmed', async () => {
    (prisma.inventoryAdjustment.findMany as any).mockResolvedValue([
      { dateKey: '2026-11-01', manualOverrideUnits: 2 },
    ]);

    const result = await syncHospedinAvailability({
      beginDate: '2026-11-01',
      endDate: '2026-11-01',
      clearManualOverrides: true,
    });

    expect(prisma.inventoryAdjustment.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({
        hospedinUnits: 6,
        manualOverrideUnits: null,
        totalUnits: 5,
      }),
    }));
    expect(result.results[0]).toMatchObject({
      manualOverrides: [{
        date: '2026-11-01',
        hospedinUnits: 6,
        automaticUnits: 5,
        manualUnits: 2,
      }],
    });
  });
});
