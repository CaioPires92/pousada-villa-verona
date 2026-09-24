const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const accommodations = [
    {
      name: 'Cabana Boutique',
      description: 'Uma cabana luxuosa com vista para a montanha.',
      capacity: 2,
      basePrice: 500,
      amenities: 'Wi-Fi; Banheira; Lareira',
      totalUnits: 2,
      photo: '/fotos/ala-principal/apartamentos/superior/DSC_0069-1200.webp'
    },
    {
      name: 'Casa Vista',
      description: 'Nossa acomodação mais exclusiva com piscina privativa.',
      capacity: 4,
      basePrice: 1200,
      amenities: 'Wi-Fi; Piscina Privativa; Churrasqueira',
      totalUnits: 1,
      photo: '/fotos/piscina-aptos/DJI_0845.jpg'
    },
    {
      name: 'Chalé da Mata',
      description: 'Chalé aconchegante cercado pela natureza.',
      capacity: 3,
      basePrice: 350,
      amenities: 'Wi-Fi; Varanda; Rede',
      totalUnits: 3,
      photo: '/fotos/ala-chales/chales/IMG_0125-1200.webp'
    },
    {
      name: 'Suíte Luxo',
      description: 'Suíte espaçosa com todas as comodidades.',
      capacity: 2,
      basePrice: 400,
      amenities: 'Wi-Fi; Ar Condicionado; Frigobar',
      totalUnits: 4,
      photo: '/fotos/piscina-aptos/DJI_0908.jpg'
    }
  ];

  for (const acc of accommodations) {
    const roomType = await prisma.roomType.create({
      data: {
        name: acc.name,
        description: acc.description,
        capacity: acc.capacity,
        maxGuests: acc.capacity + 1,
        includedAdults: acc.capacity,
        totalUnits: acc.totalUnits,
        basePrice: acc.basePrice,
        extraAdultFee: 100,
        child6To11Fee: 50,
        amenities: acc.amenities,
      }
    });

    // Add a photo
    await prisma.photo.create({
      data: {
        url: acc.photo,
        roomTypeId: roomType.id,
      }
    });

    // Add inventory and rates for the next 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      await prisma.inventoryAdjustment.create({
        data: {
          roomTypeId: roomType.id,
          date: date,
          dateKey: dateKey,
          totalUnits: acc.totalUnits,
          occupiedUnits: 0,
        }
      });

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      await prisma.rate.create({
        data: {
          roomTypeId: roomType.id,
          startDate: date,
          endDate: nextDay,
          price: acc.basePrice,
        }
      });
    }
  }

  console.log('Mock accommodations seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
