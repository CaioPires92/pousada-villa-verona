import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!expected || !provided || provided !== expected) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || password.length < 16) {
        return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({
        where: { email },
        update: { passwordHash, isActive: true },
        create: { email, passwordHash, isActive: true },
    });

    return NextResponse.json({ ok: true });
}
