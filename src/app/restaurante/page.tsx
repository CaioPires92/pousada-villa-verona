import Image from "next/image";
import { RestaurantGallery } from '@/components/RestaurantGallery';
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Restaurante e café da manhã em Serra Negra | Pousada Villa Verona",
    description:
        "Conheça o restaurante e o café da manhã da Pousada Villa Verona em Serra Negra. Ambiente acolhedor para começar o dia com tranquilidade.",
    path: "/restaurante",
    image: "/fotos/cafe-da-manha/791641806.jpg",
});

const restaurantImages = [
    '/fotos/cafe-da-manha/791641807.jpg',
    '/fotos/cafe-da-manha/791641806.jpg',
    '/fotos/cafe-da-manha/791641805.jpg',
    '/fotos/cafe-da-manha/791641801.jpg',
    '/fotos/cafe-da-manha/791641804.jpg',
    '/fotos/cafe-da-manha/791641803.jpg',
    '/fotos/cafe-da-manha/791641795.jpg',
    '/fotos/cafe-da-manha/791641809.jpg',
    '/fotos/cafe-da-manha/791641783.jpg',
    '/fotos/cafe-da-manha/791641802.jpg',
    '/fotos/cafe-da-manha/791641618.jpg',
    '/fotos/cafe-da-manha/881575157.jpg'
];

export default function RestaurantPage() {
    return (
        <main className="min-h-screen bg-background">
            <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-[color:var(--brand-black)]">
                <div className="absolute inset-0">
                    <Image
                        src="/fotos/cafe-da-manha/791641806.jpg"
                        alt="Restaurante Pousada Villa Verona"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,50,35,0.78)_0%,rgba(40,50,35,0.52)_42%,rgba(9,9,9,0.24)_100%)]" />
                </div>

                <div className="container relative z-10 py-24 text-center text-white md:py-28">
                    <p className="font-accent text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-gold">
                        Restaurante
                    </p>
                    <h1 className="font-hero-display mt-4 text-[2.9rem] font-semibold leading-[0.96] md:text-[4rem]">
                        Restaurante e Café da Manhã
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/88 md:text-lg">
                        Comece seu dia com nosso delicioso café da manhã servido em um ambiente aconchegante e acolhedor.
                    </p>
                </div>
            </section>

            <section className="section-space-md bg-[color:var(--brand-cream)]">
            <div className="container">
                <div className="mb-12 space-y-4 text-center md:mb-16">
                    <p className="font-sans text-[1.9rem] font-semibold leading-tight text-brand-brown-dark md:text-[2.4rem]">
                        &ldquo;Preparados tudo com muito carinho para você e sua família.&rdquo;
                    </p>
                    <div className="inline-block border border-brand-brown-dark/10 bg-[color:var(--brand-white)] px-6 py-3">
                        <p className="font-sans font-medium text-brand-brown-dark">
                            Horário: das 8:30h às 10:30h na Ala Principal
                        </p>
                    </div>
                </div>

                <RestaurantGallery images={restaurantImages} />
            </div>
            </section>
        </main>
    );
}
