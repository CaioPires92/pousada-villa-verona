UPDATE "RoomType"
SET "totalUnits" = 2,
    "inventoryFor4Guests" = MIN("inventoryFor4Guests", 2)
WHERE "name" = 'Quarto Quádruplo Comfort';
