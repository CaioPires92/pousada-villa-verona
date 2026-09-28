import { addDays, format } from 'date-fns';

import prisma from '@/lib/prisma';
import { hospedinClient } from '@/lib/hospedin';

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

  const results = [];

  for (const room of roomTypes) {
    try {
      const days = await hospedinClient.getAvailability(
        room.externalId!,
        options.beginDate,
        options.endDate
      );

      for (const day of days) {
        const dateKey = day.date;
        const date = new Date(`${dateKey}T00:00:00Z`);
        const nextDate = addDays(date, 1);
        const availableUnits = Math.max(
          0,
          Math.min(room.totalUnits, Number(day.availability) || 0)
        );

        await prisma.inventoryAdjustment.upsert({
          where: { roomTypeId_dateKey: { roomTypeId: room.id, dateKey } },
          update: {
            totalUnits: availableUnits,
            occupiedUnits: Math.max(0, room.totalUnits - availableUnits),
            date,
          },
          create: {
            roomTypeId: room.id,
            dateKey,
            date,
            totalUnits: availableUnits,
            occupiedUnits: Math.max(0, room.totalUnits - availableUnits),
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

      results.push({ roomName: room.name, daysSynced: days.length });
    } catch (error) {
      results.push({
        roomName: room.name,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

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
