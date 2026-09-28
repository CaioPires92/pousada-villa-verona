const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Deletando inventory, rates, photos e room types antigos...');
    await prisma.inventoryAdjustment.deleteMany({});
    await prisma.rate.deleteMany({});
    await prisma.photo.deleteMany({});
    await prisma.roomType.deleteMany({});
    
    console.log('Inserindo novos quartos...');
    const rooms = [
        {
            name: 'Quarto Triplo',
            description: 'Ideal para casais com 1 filho ou pequenos grupos de amigos que buscam conforto e ótimo custo-benefício.',
            capacity: 3,
            maxGuests: 3,
            basePrice: 350,
            amenities: 'Wi-Fi gratuito; TV de tela plana; Frigobar; Banheiro privativo com chuveiro quente; Armário/guarda-roupa; Roupas de cama e toalhas inclusas',
            totalUnits: 5,
            photo: '/fotos/quartos/triplo/849059556.jpg',
        },
        {
            name: 'Quarto Quádruplo',
            description: 'Prático e funcional para famílias com duas crianças ou grupos de amigos.',
            capacity: 4,
            maxGuests: 4,
            basePrice: 450,
            amenities: 'Wi-Fi; Banheiro privativo; TV de tela plana; Frigobar; Armário para bagagens; Roupas de cama/banho',
            totalUnits: 4,
            photo: '/fotos/quartos/quadruplo/849061453.jpg',
        },
        {
            name: 'Quarto Quádruplo Comfort',
            description: 'Para hóspedes que priorizam mais espaço e conveniência durante a estadia.',
            capacity: 4,
            maxGuests: 4,
            basePrice: 550,
            amenities: 'Maior espaço interno; Disposição diferenciada; Wi-Fi; TV de tela plana; Frigobar; Armário; Banheiro privativo',
            totalUnits: 3,
            photo: '/fotos/quartos/quadruplo-comfort/883982350.jpg',
        },
        {
            name: 'Quarto Quíntuplo',
            description: 'Perfeito para famílias e grupos de até cinco pessoas que desejam ficar juntos no mesmo ambiente.',
            capacity: 5,
            maxGuests: 5,
            basePrice: 700,
            amenities: 'Espaço amplo com múltiplas camas; Banheiro privativo; TV de tela plana; Frigobar; Enxoval completo; Wi-Fi',
            totalUnits: 2,
            photo: '/fotos/quartos/familia/849062686.jpg',
        },
    ];

    for (const acc of rooms) {
        const roomType = await prisma.roomType.create({
            data: {
                name: acc.name,
                description: acc.description,
                capacity: acc.capacity,
                maxGuests: acc.maxGuests,
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

    console.log('Novos quartos criados com sucesso!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
