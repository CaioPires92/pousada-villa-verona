import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

const EXPECTED_ROOMS = [
    'Quarto Triplo',
    'Quarto Quádruplo',
    'Quarto Quádruplo Comfort',
    'Quarto Quíntuplo',
];

export async function POST(request: Request) {
    const expectedSecret = String(process.env.ROOM_PRICING_UPDATE_SECRET || '');
    const providedSecret = String(request.headers.get('x-update-secret') || '');

    if (!expectedSecret || providedSecret !== expectedSecret) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const rooms = await prisma.roomType.findMany({
        where: { name: { in: EXPECTED_ROOMS } },
        select: { id: true, name: true },
    });
    if (rooms.length !== EXPECTED_ROOMS.length) {
        return NextResponse.json(
            { error: 'rooms_not_found', found: rooms.map((room) => room.name) },
            { status: 409 }
        );
    }

    await prisma.$transaction([
        prisma.roomType.update({
            where: { id: rooms.find((room) => room.name === 'Quarto Triplo')!.id },
            data: { includedAdults: 2, extraAdultFee: 100, child6To11Fee: 80 },
        }),
        ...rooms
            .filter((room) => room.name !== 'Quarto Triplo')
            .map((room) => prisma.roomType.update({
                where: { id: room.id },
                data: { extraAdultFee: 0, child6To11Fee: 0 },
            })),
    ]);

    return NextResponse.json({ ok: true, updated: EXPECTED_ROOMS });
}
