import { createHash, timingSafeEqual } from 'node:crypto';

import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TableColumn = {
  name: string;
};

function isAuthorized(request: Request): boolean {
  const configuredToken = process.env.PET_MIGRATION_TOKEN;
  const authorization = request.headers.get('authorization');

  if (!configuredToken || !authorization?.startsWith('Bearer ')) {
    return false;
  }

  const providedToken = authorization.slice('Bearer '.length);
  const configuredHash = createHash('sha256').update(configuredToken).digest();
  const providedHash = createHash('sha256').update(providedToken).digest();

  return timingSafeEqual(configuredHash, providedHash);
}

async function hasPetsColumn(): Promise<boolean> {
  const columns = await prisma.$queryRawUnsafe<TableColumn[]>(
    'PRAGMA table_info("Booking")',
  );

  return columns.some((column) => column.name === 'pets');
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    if (await hasPetsColumn()) {
      return Response.json({ ok: true, applied: false, petsColumn: true });
    }

    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Booking" ADD COLUMN "pets" INTEGER NOT NULL DEFAULT 0',
    );

    const petsColumn = await hasPetsColumn();

    return Response.json(
      { ok: petsColumn, applied: true, petsColumn },
      { status: petsColumn ? 200 : 500 },
    );
  } catch (error) {
    console.error('PET_MIGRATION_FAILED', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return Response.json({ ok: false }, { status: 500 });
  }
}
