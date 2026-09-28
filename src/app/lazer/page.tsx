import Image from "next/image";
import { LeisureCard } from "@/components/LeisureCard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Lazer com piscina e área de descanso | Pousada Villa Verona",
    description:
        "Veja a estrutura de lazer da Pousada Villa Verona em Serra Negra, com piscinas, churrasqueiras, jardim, sala de jogos e espaços para famílias.",
    path: "/lazer",
    image: "/fotos/areas-externas/881575120.jpg",
});

interface LeisureItem {
    id: string;
    title: string;
    description: string;
    images: string[];
    wing: 'principal' | 'anexo';
}

const leisureItems: LeisureItem[] = [
    {
        id: 'piscina-principal',
        title: 'Piscina Adulto e Infantil',
        description: 'Lazer para todas as idades.',
        images: [
            '/fotos/areas-externas/849028896.jpg',
            '/fotos/areas-externas/849028898.jpg',
            '/fotos/areas-externas/881575120.jpg',
            '/fotos/areas-externas/881575135.jpg',
            '/fotos/areas-externas/849034797.jpg'
        ],
        wing: 'principal'
    },
    {
        id: 'esportes',
        title: 'Esportes ao ar livre',
        description: 'Campo, quadras e atividades para toda a família.',
        images: [
            '/fotos/areas-externas/849030894.jpg',
            '/fotos/areas-externas/849030860.jpg',
            '/fotos/areas-externas/849032553.jpg',
            '/fotos/areas-externas/849032554.jpg',
            '/fotos/areas-externas/881575127.jpg',
            '/fotos/areas-externas/881575145.jpg'
        ],
        wing: 'principal'
    },
    {
        id: 'sala-jogos',
        title: 'Sala de Jogos e TV',
        description: 'Sinuca, pebolim, TV e tempo de descanso.',
        images: [
            '/fotos/sala-de-jogos/881575082.jpg',
            '/fotos/sala-de-jogos/672531136.jpg',
            '/fotos/sala-de-jogos/672531128.jpg',
            '/fotos/sala-de-jogos/881575079.jpg',
            '/fotos/sala-de-jogos/881575100.jpg',
            '/fotos/sala-de-jogos/881575132.jpg'
        ],
        wing: 'principal'
    },
    {
        id: 'jardim-redes',
        title: 'Jardim com Redes',
        description: 'Verde, redes e descanso sem pressa.',
        images: [
            '/fotos/areas-externas/849035415.jpg',
            '/fotos/areas-externas/849034796.jpg',
            '/fotos/areas-externas/791712290.jpg',
            '/fotos/areas-externas/791712277.jpg',
            '/fotos/areas-externas/881575151.jpg',
            '/fotos/areas-externas/881575153.jpg'
        ],
        wing: 'principal'
    },
    {
        id: 'parquinho',
        title: 'Espaço infantil',
        description: 'Parquinho e amplo gramado para as crianças.',
        images: [
            '/fotos/areas-externas/881575149.jpg',
            '/fotos/areas-externas/849034796.jpg',
            '/fotos/areas-externas/849036361.jpg'
        ],
        wing: 'principal'
    }
];

export default function LeisurePage() {
    const principalItems = leisureItems.filter(item => item.wing === 'principal');
    const annexItems = leisureItems.filter(item => item.wing === 'anexo');

    const renderLeisureGrid = (items: LeisureItem[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
                <LeisureCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    images={item.images}
                />
            ))}
        </div>
    );

    return (
        <main className="min-h-screen bg-background">
            <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-[color:var(--brand-black)]">
                <div className="absolute inset-0">
                    <Image
                        src="/fotos/areas-externas/881575120.jpg"
                        alt="Lazer Pousada Villa Verona"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,50,35,0.72)_0%,rgba(40,50,35,0.52)_42%,rgba(9,9,9,0.26)_100%)]" />
                </div>
                <div className="container relative z-10 py-24 text-center text-white md:py-28">
                    <div className="mx-auto max-w-3xl px-6 py-8 md:px-10">
                        <p className="font-accent text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-gold [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                            Lazer
                        </p>
                        <h1 className="font-hero-display mt-4 text-[2.9rem] font-semibold leading-[0.96] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.58)] md:text-[4rem]">
                            Lazer e Diversão
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.52)] md:text-lg">
                            Estrutura completa para o seu descanso em todas as alas.
                        </p>
                    </div>
                </div>
            </section>

            <div className="space-y-0">
                {/* Ala Principal Section */}
                <section className="section-space-md bg-[color:var(--brand-cream)]">
                    <div className="container">
                    <div className="mb-10 border-b border-brand-brown-dark/10 pb-4">
                        <h2 className="font-hero-display text-[2.2rem] font-semibold leading-tight text-brand-brown-dark md:text-[3rem]">Ala Principal</h2>
                        <p className="mt-2 text-[1.02rem] leading-7 text-foreground/72">
                            Piscina adulto e infantil, bar, jogos e muito verde.
                        </p>
                    </div>
                    {renderLeisureGrid(principalItems)}
                    </div>
                </section>

                {/* Ala Anexo Section */}
                <section className="section-space-md bg-background">
                    <div className="container">
                    <div className="mb-10 border-b border-brand-brown-dark/10 pb-4">
                        <h2 className="font-hero-display text-[2.2rem] font-semibold leading-tight text-brand-brown-dark md:text-[3rem]">Ala Chalés e Anexos</h2>
                        <p className="mt-2 flex items-center gap-2 text-[1.02rem] leading-7 text-foreground/72">
                            <span className="inline-block w-2 h-2 rounded-full bg-brand-gold"></span>
                            Privacidade com piscina e área comum de churrasqueira.
                        </p>
                    </div>
                    {renderLeisureGrid(annexItems)}
                    </div>
                </section>
            </div>
        </main>
    );
}
