import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { getDefaultHospedinPeriod, syncHospedinAvailability } from '@/lib/hospedin-sync';
import prisma from '@/lib/prisma';
import { getAutomaticInventory } from '@/lib/inventory-policy';

export async function POST(request: Request) {
    const startTime = Date.now();
    try {
        const auth = await requireAdminAuth();
        if (auth instanceof Response) return auth;

        if (process.env.HOSPEDIN_SYNC_ENABLED !== 'true') {
            return NextResponse.json({ error: 'Sincronização com Hospedin desativada.' }, { status: 503 });
        }

        // Extract body early
        const body = await request.json().catch(() => ({}));
        const { startDate: reqStart, endDate: reqEnd, roomTypeId, confirmOverwriteManual } = body;

        const defaults = getDefaultHospedinPeriod();
        const beginDate = reqStart || defaults.beginDate;
        const endDate = reqEnd || defaults.endDate;
        const manualOverrides = await prisma.inventoryAdjustment.findMany({
            where: {
                dateKey: { gte: beginDate, lte: endDate },
                manualOverrideUnits: { not: null },
                ...(roomTypeId ? { roomTypeId } : {}),
            },
            select: {
                dateKey: true,
                hospedinUnits: true,
                manualOverrideUnits: true,
                roomType: { select: { name: true, totalUnits: true } },
            },
        });
        if (manualOverrides.length > 0 && !confirmOverwriteManual) {
            return NextResponse.json({
                error: 'MANUAL_OVERRIDES_WILL_BE_REPLACED',
                message: 'A sincronização substituirá ajustes manuais pelo inventário automático do Hospedin.',
                overrides: manualOverrides.map((row) => ({
                    roomName: row.roomType.name,
                    date: row.dateKey,
                    hospedinUnits: row.hospedinUnits,
                    automaticUnits: row.hospedinUnits === null
                        ? row.roomType.totalUnits
                        : getAutomaticInventory(row.hospedinUnits, row.roomType.totalUnits),
                    manualUnits: row.manualOverrideUnits,
                })),
            }, { status: 409 });
        }
        const sync = await syncHospedinAvailability({
            beginDate,
            endDate,
            roomTypeId,
            clearManualOverrides: true,
        });

        const failedResults = sync.results.filter((result) => 'error' in result && result.error);
        if (failedResults.length === sync.results.length) {
            return NextResponse.json({
                error: 'O Hospedin não sincronizou nenhuma acomodação.',
                results: sync.results,
            }, { status: 502 });
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        return NextResponse.json({ 
            message: 'Sincronização processada!', 
            results: sync.results,
            duration: `${duration}s`,
            partialFailure: failedResults.length > 0,
        }, { status: failedResults.length > 0 ? 207 : 200 });
    } catch (error) {
        console.error('Erro na sincronização Hospedin:', error);
        return NextResponse.json({ 
            error: 'Erro fatal na sincronização com Hospedin' 
        }, { status: 500 });
    }
}
