import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';
import { getDefaultHospedinPeriod, syncHospedinAvailability } from '@/lib/hospedin-sync';

export async function POST(request: Request) {
    const startTime = Date.now();
    try {
        const auth = await requireAdminAuth();
        if (auth instanceof Response) return auth;

        // Extract body early
        const body = await request.json().catch(() => ({}));
        const { startDate: reqStart, endDate: reqEnd, roomTypeId } = body;

        const defaults = getDefaultHospedinPeriod();
        const sync = await syncHospedinAvailability({
            beginDate: reqStart || defaults.beginDate,
            endDate: reqEnd || defaults.endDate,
            roomTypeId,
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        return NextResponse.json({ 
            message: 'Sincronização processada!', 
            results: sync.results,
            duration: `${duration}s`
        });
    } catch (error) {
        console.error('Erro na sincronização Hospedin:', error);
        return NextResponse.json({ 
            error: 'Erro fatal na sincronização com Hospedin' 
        }, { status: 500 });
    }
}
