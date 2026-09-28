import Image from 'next/image';
import { Leaf, MapPin, ShoppingBag, Coffee, Sparkles, Pin } from 'lucide-react';
import GalleryGrid, { type GalleryPhoto } from '@/app/galeria/GalleryGrid';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Serra Negra | Pousada Villa Verona',
  description: 'Descubra os encantos de Serra Negra, o destino perfeito no Circuito das Águas Paulista.',
  path: '/serra-negra',
  image: '/fotos/serra-negra/01-SerraNegraCover.a6716675.png',
});

const cityPhotos: GalleryPhoto[] = [
  { src: '/fotos/serra-negra/01-SerraNegraCover.a6716675.png', alt: 'Pôr do sol no Alto da Serra em Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/02-alto-da-serra-5.webp', alt: 'Mirante do Alto da Serra ao pôr do sol', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/03-chafariz.webp', alt: 'Chafariz iluminado no centro de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/04-cristo-redentor-2.webp', alt: 'Cristo Redentor e vista panorâmica de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/05-passeio-balao.webp', alt: 'Passeio de balão sobre as montanhas', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/06-jeep-4x4.webp', alt: 'Passeio rural de jipe 4x4', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/07-alto-da-serra-4.webp', alt: 'Paisagem no Alto da Serra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/08-fontana-di-trevi.webp', alt: 'Fontana di Trevi de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/09-coronel.webp', alt: 'Comércio no centro de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/10-para-pente.webp', alt: 'Voos de parapente no Alto da Serra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/11-centro-cidade.webp', alt: 'Praça arborizada no centro da cidade', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/12-centro-da-cidade-1.webp', alt: 'Fonte e jardins no centro de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/13-trenzinho.webp', alt: 'Passeio de trenzinho em Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/14-igreja.webp', alt: 'Interior de igreja em Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/15-igreja-2.webp', alt: 'Igreja no centro de Serra Negra', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/16-jipe-4x4-2.webp', alt: 'Visitantes em passeio de jipe 4x4', category: 'Serra Negra' },
  { src: '/fotos/serra-negra/17-teleferico-serra-negra-1.webp', alt: 'Teleférico e Cristo Redentor de Serra Negra', category: 'Serra Negra' },
];

export default function SerraNegraPage() {
    return (
        <main className="min-h-screen bg-brand-sand">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/fotos/serra-negra/01-SerraNegraCover.a6716675.png"
                        alt="Pôr do sol no Alto da Serra em Serra Negra"
                        fill
                        sizes="100vw"
                        quality={90}
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="font-hero-display text-5xl md:text-7xl text-white font-medium mb-6 leading-tight">
                        Encante-se <br/> com Serra Negra
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-light tracking-wide">
                        Natureza e Bem-Estar
                    </p>
                </div>
            </section>

            {/* Intro Text */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
                <div className="space-y-6 text-foreground/70 leading-relaxed text-lg font-light">
                    <p>
                        Localizada no coração do Circuito das Águas Paulista, Serra Negra é um dos destinos mais encantadores do interior de São Paulo. Cercada por montanhas e com clima agradável durante todo o ano, a cidade combina natureza, lazer, compras e experiências únicas em um só lugar.
                    </p>
                    <p>
                        A aproximadamente 150 km da capital e a cerca de 70 km de Campinas, Serra Negra é perfeita tanto para um fim de semana quanto para uma viagem mais longa, oferecendo fácil acesso e uma excelente estrutura turística.
                    </p>
                    <p>
                        Aqui, você encontra tranquilidade, belas paisagens e diversas opções de passeios para todos os estilos.
                    </p>
                </div>
            </section>

            {/* Cards Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-brand-brown/5 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center mb-8 text-brand-brown">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <h3 className="font-hero-display text-2xl text-brand-brown-dark mb-4">Natureza e Bem-estar</h3>
                        <p className="text-foreground/70 mb-6 font-light leading-relaxed">
                            Serra Negra é rodeada por montanhas da Serra da Mantiqueira, com paisagens exuberantes e diversas opções de contato direto com a natureza.
                        </p>
                        <ul className="space-y-3 text-foreground/70 font-light mb-auto">
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Alto da Serra – mirante com vista panorâmica da região</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Passeio de balão</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Passeio rural veículo 4X4</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Passeio quadriciclo</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Voo duplo de parapente</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Parques ecológicos e trilhas</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Cachoeiras e fontes naturais</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Passeios rurais em meio à natureza</li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-brand-brown/10 flex gap-4 text-brand-gold">
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-wider">IDEAL PARA QUEM BUSCA RELAXAR, RESPIRAR AR PURO E SE RECONECTAR</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-brand-brown/5 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center mb-8 text-brand-brown">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-hero-display text-2xl text-brand-brown-dark mb-4">Turismo e Lazer na Cidade</h3>
                        <p className="text-foreground/70 mb-6 font-light leading-relaxed">
                            O centro de Serra Negra reúne charme, história e atrações para todas as idades, com fácil acesso e clima acolhedor.
                        </p>
                        <ul className="space-y-3 text-foreground/70 font-light mb-auto">
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Teleférico com vista panorâmica da cidade</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Cristo Redentor de Serra Negra</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Fontana di Trevi (réplica da famosa fonte italiana)</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Igreja Nossa Senhora do Rosário</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Passeio de Maria Fumaça</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Praças e fontes no centro da cidade</li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-brand-brown/10 flex gap-4 text-brand-gold/80 italic">
                            <Pin className="w-5 h-5 shrink-0" />
                            <p className="text-sm">O teleférico é uma das atrações mais tradicionais, ligando o centro ao alto da cidade com uma vista privilegiada das montanhas.</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-brand-brown/5 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center mb-8 text-brand-brown">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="font-hero-display text-2xl text-brand-brown-dark mb-4">Compras e Produtos Locais</h3>
                        <p className="text-foreground/70 mb-6 font-light leading-relaxed">
                            Serra Negra também é um destino conhecido pelo turismo de compras, com um comércio diversificado e muito procurado pelos visitantes.
                        </p>
                        <ul className="space-y-3 text-foreground/70 font-light mb-auto">
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Malhas e tricôs direto da fábrica</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Produtos em couro</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Artesanato local</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Doces, queijos, cafés, cachaças e produtos típicos</li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-brand-brown/10 flex gap-4 text-brand-gold/80 italic">
                            <Pin className="w-5 h-5 shrink-0" />
                            <p className="text-sm">O centro funciona como um verdadeiro "shopping a céu aberto", com lojas abertas inclusive aos finais de semana.</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-3xl p-10 shadow-sm border border-brand-brown/5 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center mb-8 text-brand-brown">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <h3 className="font-hero-display text-2xl text-brand-brown-dark mb-4">Experiências e Sabores da Região</h3>
                        <p className="text-foreground/70 mb-6 font-light leading-relaxed">
                            Além dos pontos turísticos, a cidade oferece experiências autênticas ligadas à cultura e à produção local.
                        </p>
                        <ul className="space-y-3 text-foreground/70 font-light mb-auto">
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Rotas do café, vinho e queijo</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Visitas a vinícolas e propriedades rurais</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Degustação de produtos artesanais</li>
                            <li className="flex items-start gap-2"><span className="text-brand-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0"/> Festivais e eventos culturais ao longo do ano</li>
                        </ul>
                        <div className="mt-8 pt-6 border-t border-brand-brown/10 flex flex-col gap-4 text-brand-gold/80 italic">
                            <div className="flex gap-4">
                                <Pin className="w-5 h-5 shrink-0" />
                                <p className="text-sm">O turismo rural é um dos grandes destaques da região, com produção de cafés, queijos, vinhos e outros produtos artesanais.</p>
                            </div>
                            <div className="flex gap-4 bg-brand-sand/30 p-4 rounded-xl mt-2 text-brand-brown-dark">
                                <Sparkles className="w-5 h-5 shrink-0 text-brand-gold" />
                                <p className="text-sm not-italic font-medium">Dica valiosa: Contrate um passeio 4x4 para acessar as vinícolas e rotas do café, vinho e queijo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <p className="font-accent text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">GALERIA VISUAL</p>
                    <h2 className="font-hero-display text-4xl text-brand-brown-dark">Retratos da cidade</h2>
                    <div className="w-12 h-px bg-brand-gold mx-auto mt-6"></div>
                </div>

                <GalleryGrid photos={cityPhotos} categories={[]} showFilters={false} />
            </section>
        </main>
    );
}
