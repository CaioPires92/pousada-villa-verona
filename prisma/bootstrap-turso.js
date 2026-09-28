const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const { createClient } = require('@libsql/client');

const rooms = [
  {
    name: 'Quarto Triplo',
    description: 'Ideal para casais com 1 filho ou pequenos grupos de amigos que buscam conforto e ótimo custo-benefício.',
    capacity: 3,
    maxGuests: 3,
    totalUnits: 5,
    basePrice: 350,
    amenities: 'Wi-Fi gratuito; TV de tela plana; Frigobar; Banheiro privativo com chuveiro quente; Armário/guarda-roupa; Roupas de cama e toalhas inclusas',
    photo: '/fotos/quartos/triplo/849059556.jpg',
  },
  {
    name: 'Quarto Quádruplo',
    description: 'Prático e funcional para famílias com duas crianças ou grupos de amigos.',
    capacity: 4,
    maxGuests: 4,
    totalUnits: 4,
    basePrice: 450,
    amenities: 'Wi-Fi; Banheiro privativo; TV de tela plana; Frigobar; Armário para bagagens; Roupas de cama/banho',
    photo: '/fotos/quartos/quadruplo/849061453.jpg',
  },
  {
    name: 'Quarto Quádruplo Comfort',
    description: 'Para hóspedes que priorizam mais espaço e conveniência durante a estadia.',
    capacity: 4,
    maxGuests: 4,
    totalUnits: 3,
    basePrice: 550,
    amenities: 'Maior espaço interno; Disposição diferenciada; Wi-Fi; TV de tela plana; Frigobar; Armário; Banheiro privativo',
    photo: '/fotos/quartos/quadruplo-comfort/883982350.jpg',
  },
  {
    name: 'Quarto Família',
    description: 'Perfeito para famílias grandes que desejam ficar juntas no mesmo ambiente.',
    capacity: 6,
    maxGuests: 6,
    totalUnits: 2,
    basePrice: 700,
    amenities: 'Espaço amplo com múltiplas camas; Banheiro privativo; TV de tela plana; Frigobar; Enxoval completo; Wi-Fi',
    photo: '/fotos/quartos/familia/849062686.jpg',
  },
];

async function main() {
  const databaseUrl = String(process.env.DATABASE_URL || '');
  const authToken = String(process.env.DATABASE_AUTH_TOKEN || '');

  if (!databaseUrl.startsWith('libsql:') && !databaseUrl.startsWith('wss:')) {
    console.log('[database] Bootstrap ignorado: o banco não é Turso/libSQL.');
    return;
  }

  const client = createClient({
    url: databaseUrl.split('?')[0],
    authToken,
  });

  try {
    const tableResult = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'RoomType'"
    );

    if (tableResult.rows.length === 0) {
      const migrationPath = path.join(
        process.cwd(),
        'prisma/migrations/20260922134553_initial_reservation_schema/migration.sql'
      );
      await client.executeMultiple(fs.readFileSync(migrationPath, 'utf8'));
      console.log('[database] Estrutura inicial criada.');
    }

    const roomCount = await client.execute('SELECT COUNT(*) AS total FROM "RoomType"');
    if (Number(roomCount.rows[0]?.total || 0) > 0) {
      console.log('[database] Acomodações já cadastradas; nenhuma alteração realizada.');
      return;
    }

    const now = new Date().toISOString();
    const statements = [];

    for (const room of rooms) {
      const roomId = crypto.randomUUID();
      statements.push({
        sql: `INSERT INTO "RoomType" (
          "id", "name", "description", "capacity", "maxGuests",
          "inventoryFor4Guests", "includedAdults", "totalUnits", "basePrice",
          "extraAdultFee", "child6To11Fee", "amenities", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          roomId,
          room.name,
          room.description,
          room.capacity,
          room.maxGuests,
          room.capacity >= 4 ? room.totalUnits : 0,
          2,
          room.totalUnits,
          room.basePrice,
          100,
          50,
          room.amenities,
          now,
          now,
        ],
      });
      statements.push({
        sql: 'INSERT INTO "Photo" ("id", "url", "position", "roomTypeId") VALUES (?, ?, ?, ?)',
        args: [crypto.randomUUID(), room.photo, 0, roomId],
      });
    }

    await client.batch(statements, 'write');
    console.log(`[database] ${rooms.length} acomodações cadastradas com sucesso.`);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error('[database] Falha no bootstrap:', error);
  process.exit(1);
});
