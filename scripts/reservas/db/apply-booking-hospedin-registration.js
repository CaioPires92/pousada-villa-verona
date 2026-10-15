const { createClient } = require('@libsql/client');

const confirmed = process.argv.includes('--confirm=YES');
const isProductionBuild = process.env.VERCEL_ENV === 'production';
const url = process.env.DATABASE_URL || '';
const authToken = process.env.DATABASE_AUTH_TOKEN || '';

if (!isProductionBuild) {
  console.log('Migração Hospedin ignorada fora do build de produção da Vercel.');
  process.exit(0);
}

if (!confirmed) {
  throw new Error('Confirmação --confirm=YES obrigatória.');
}

if (!url.startsWith('libsql://') || !authToken) {
  throw new Error('Credenciais do banco Turso de produção ausentes ou inválidas.');
}

const client = createClient({ url: url.split('?')[0], authToken });

async function bookingColumns() {
  const result = await client.execute('PRAGMA table_info("Booking")');
  return new Set((result.rows || []).map((row) => String(row.name ?? row[1] ?? '')));
}

async function main() {
  const before = await bookingColumns();
  if (before.size === 0) throw new Error('Tabela Booking não encontrada.');

  const missing = [
    'hospedinReservationId',
    'hospedinRegisteredAt',
  ].filter((column) => !before.has(column));

  console.log(JSON.stringify({
    database: new URL(url).hostname,
    mode: 'apply',
    missingColumns: missing,
  }, null, 2));

  if (missing.includes('hospedinReservationId')) {
    await client.execute('ALTER TABLE "Booking" ADD COLUMN "hospedinReservationId" TEXT');
  }
  if (missing.includes('hospedinRegisteredAt')) {
    await client.execute('ALTER TABLE "Booking" ADD COLUMN "hospedinRegisteredAt" DATETIME');
  }
  await client.execute('CREATE INDEX IF NOT EXISTS "Booking_hospedinRegisteredAt_idx" ON "Booking"("hospedinRegisteredAt")');

  const after = await bookingColumns();
  const index = await client.execute(`
    SELECT name FROM sqlite_master
    WHERE type = 'index' AND name = 'Booking_hospedinRegisteredAt_idx'
  `);
  const verified = after.has('hospedinReservationId')
    && after.has('hospedinRegisteredAt')
    && (index.rows || []).length === 1;

  console.log(JSON.stringify({ applied: true, verified }, null, 2));
  if (!verified) throw new Error('Falha na verificação pós-migração.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
