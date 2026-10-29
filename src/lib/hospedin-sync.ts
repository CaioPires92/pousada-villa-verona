import { addDays, format } from 'date-fns';

import prisma from '@/lib/prisma';
import { hospedinClient } from '@/lib/hospedin';
import { clampInventory, getEffectiveInventory } from '@/lib/inventory-policy';

type SyncHospedinOptions = {
  beginDate: string;
  endDate: string;
  roomTypeId?: string;
};

export async function syncHospedinAvailability(options: SyncHospedinOptions) {
  const roomTypes = await prisma.roomType.findMany({
    where: {
      externalId: { not: null },
      NOT: { externalId: '' },
      ...(options.roomTypeId ? { id: options.roomTypeId } : {}),
    },
  });

  if (roomTypes.length === 0) {
    throw new Error(
      options.roomTypeId
        ? 'Acomodação selecionada não possui ID do Hospedin configurado.'
        : 'Nenhuma acomodação possui ID do Hospedin configurado.'
    );
  }

  const results = await Promise.all(roomTypes.map(async (room) => {
    try {
      const days = await hospedinClient.getAvailability(
        room.externalId!,
        options.beginDate,
        options.endDate
      );

      const existingAdjustments = await prisma.inventoryAdjustment.findMany({
        where: {
          roomTypeId: room.id,
          dateKey: { in: days.map((day) => day.date) },
        },
      });
      const existingByDate = new Map(existingAdjustments.map((row) => [row.dateKey, row]));

      for (const day of days) {
        const dateKey = day.date;
        const date = new Date(`${dateKey}T00:00:00Z`);
        const nextDate = addDays(date, 1);
        const hospedinUnits = clampInventory(day.availability, room.totalUnits);
        const manualOverrideUnits = existingByDate.get(dateKey)?.manualOverrideUnits ?? null;
        const availableUnits = getEffectiveInventory({
          hospedinUnits,
          manualOverrideUnits,
          capacity: room.totalUnits,
        });
        const hospedinSyncedAt = new Date();

        await prisma.inventoryAdjustment.upsert({
          where: { roomTypeId_dateKey: { roomTypeId: room.id, dateKey } },
          update: {
            totalUnits: availableUnits,
            occupiedUnits: Math.max(0, room.totalUnits - hospedinUnits),
            hospedinUnits,
            manualOverrideUnits,
            hospedinSyncedAt,
            date,
          },
          create: {
            roomTypeId: room.id,
            dateKey,
            date,
            totalUnits: availableUnits,
            occupiedUnits: Math.max(0, room.totalUnits - hospedinUnits),
            hospedinUnits,
            manualOverrideUnits,
            hospedinSyncedAt,
          },
        });

        if (Number(day.rate_price) > 0) {
          await prisma.rate.upsert({
            where: {
              roomTypeId_startDate_endDate: {
                roomTypeId: room.id,
                startDate: date,
                endDate: nextDate,
              },
            },
            update: { price: Number(day.rate_price) },
            create: {
              roomTypeId: room.id,
              startDate: date,
              endDate: nextDate,
              price: Number(day.rate_price),
            },
          });
        }
      }

      return { roomName: room.name, daysSynced: days.length };
    } catch (error) {
      return {
        roomName: room.name,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }));

  return {
    beginDate: options.beginDate,
    endDate: options.endDate,
    results,
  };
}

export function getDefaultHospedinPeriod() {
  const today = new Date();
  return {
    beginDate: format(today, 'yyyy-MM-dd'),
    endDate: format(addDays(today, 60), 'yyyy-MM-dd'),
  };
}
