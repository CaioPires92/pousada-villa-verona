import Image from "next/image";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { RoomCard } from "@/components/RoomCard";
import { serializePrismaArray } from "@/lib/serialize-prisma";
import { buildPageMetadata } from "@/lib/seo";

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildPageMetadata({
    title: "Acomodações em Serra Negra | Pousada Villa Verona",
    description:
        "Conheça as acomodações da Pousada Villa Verona em Serra Negra. Compare alas, quartos, capacidade e consulte disponibilidade online.",
    path: "/acomodacoes",
    image: "/fotos/ala-principal/apartamentos/superior/DSC_0076-1200.webp",
    keywords: [
        "acomodações em Serra Negra",
        "quartos em Serra Negra",
        "chalé em Serra Negra",
        "onde ficar em Serra Negra",
    ],
});

async function getRooms() {
    const rooms = await prisma.roomType.findMany({
        include: {
            photos: true,
        },
        orderBy: {
            basePrice: 'asc',
        }
    });

    // Serialize all Prisma data (Decimal, Date, nested objects)
    return serializePrismaArray(rooms);
}

export default async function RoomsPage() {
    const rooms = await getRooms();

    return (
        <main className="min-h-screen bg-background">
            <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-[color:var(--brand-black)]">
                <div className="absolute inset-0">
                    <Image
                        src="/fotos/jardim-aptos/DJI_0904.jpg"
                        alt="Acomodações Pousada Villa Verona"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,50,35,0.78)_0%,rgba(40,50,35,0.52)_42%,rgba(9,9,9,0.24)_100%)]" />
                </div>

                <div className="container relative z-10 py-24 text-center text-white md:py-28">
                    <p className="font-accent text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-gold">
                        Hospedagem
                    </p>
                    <h1 className="font-hero-display mt-4 text-[2.9rem] font-semibold leading-[0.96] md:text-[4rem]">
                        Nossas Acomodações
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/88 md:text-lg">
                        Conforto e aconchego preparados especialmente para o seu descanso.
                        Escolha o ambiente ideal para sua estadia na Serra da Mantiqueira.
                    </p>
                </div>
            </section>

            <div className="space-y-0">
                <section className="section-space-md bg-[color:var(--brand-cream)]">
                    <div className="container">
                        <div className="mb-10 border-b border-brand-brown-dark/10 pb-4 text-center">
                            <h2 className="font-hero-display text-[2.2rem] font-semibold leading-tight text-brand-brown-dark md:text-[3rem]">Escolha seu Quarto</h2>
                            <p className="mt-2 text-[1.02rem] leading-7 text-foreground/72">
                                Diferentes opções para atender casais, pequenas e grandes famílias.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {rooms.map((room: any) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {rooms.length === 0 && (
                <div className="container section-space-sm text-center">
                    <p className="text-xl text-muted-foreground">
                        Nenhuma acomodação encontrada no momento.
                    </p>
                </div>
            )}
        </main>
    );
}
