'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Wifi, Car, Dog, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function APousadaPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = [
        { src: '/fotos/jardim-aptos/DSC_0267.jpg', alt: 'Piscina e Área de Lazer' },
        { src: '/fotos/jardim-aptos/DJI_0904.jpg', alt: 'Jardins da Pousada' },
        { src: '/fotos/Sala de jogos/DSC_0228.jpg', alt: 'Salão de Jogos' }
    ];

    return (
        <main className="min-h-screen bg-background">
            <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-[color:var(--brand-black)]">
                <div className="absolute inset-0">
                    <Image
                        src="/fotos/jardim-aptos/DSC_0267.jpg"
                        alt="A Pousada Villa Verona"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,50,35,0.78)_0%,rgba(40,50,35,0.52)_42%,rgba(9,9,9,0.24)_100%)]" />
                </div>

                <div className="container relative z-10 py-24 text-center text-white md:py-28">
                    <p className="font-accent text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-gold">
                        Conheça
                    </p>
                    <h1 className="font-hero-display mt-4 text-[2.9rem] font-semibold leading-[0.96] md:text-[4rem]">
                        A Pousada
                    </h1>
                </div>
            </section>

            <section className="section-space-md bg-[color:var(--brand-cream)] overflow-hidden">
                <div className="container max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left Side: Text content */}
                        <div className="pt-4">
                            <p className="font-accent text-xs font-bold uppercase tracking-widest text-brand-gold mb-6">
                                MAIS QUE HOSPEDAGEM
                            </p>
                            <h2 className="font-hero-display mb-8 text-[2.5rem] font-medium leading-[1.1] text-brand-brown-dark md:text-[3.5rem]">
                                Pousada Villa Verona
                            </h2>

                            <div className="prose prose-brand max-w-none text-foreground/70 leading-relaxed space-y-6 text-lg font-light">
                                <p>
                                    Localizada em meio às montanhas da Serra da Mantiqueira, a Pousada Villa Verona oferece uma experiência completa de descanso e lazer para toda a família. Desfrute de um ambiente tranquilo com piscina ao ar livre, amplo jardim gramado com redes para relaxar, lago para pesca esportiva e trilha ecológica com acesso a uma bela cachoeira.
                                </p>
                                
                                <p>
                                    Comece o dia com um delicioso café da manhã caseiro em estilo buffet e aproveite nossa estrutura com salão de jogos (bilhar e pingue-pongue), quadra esportiva, playground e restaurante no local.
                                </p>
                                
                                <p className="font-medium text-brand-brown-dark/80 pt-4">
                                    O seu refúgio de paz e natureza em Serra Negra/SP!
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-brand-brown-dark/10">
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 text-brand-gold">
                                        <Wifi className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-brand-brown-dark text-sm">Wi-Fi gratuito</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 text-brand-gold">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-brand-brown-dark text-sm">Estacionamento gratuito</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 text-brand-gold">
                                        <Dog className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-brand-brown-dark text-sm">Pet Friendly</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 text-brand-gold">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-brand-brown-dark text-sm">Check-in 14h | Check-out 11h</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Images */}
                        <div className="relative">
                            <motion.div 
                                className="relative aspect-[3/4] w-full max-w-[500px] ml-auto overflow-hidden rounded-sm cursor-pointer shadow-2xl"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => setSelectedImage(images[0].src)}
                            >
                                <Image
                                    src={images[0].src}
                                    alt={images[0].alt}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            {/* Polaroid 1 */}
                            <motion.div 
                                className="absolute -bottom-16 -left-12 lg:-left-24 w-64 bg-white p-4 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer z-10 hidden md:block"
                                initial={{ rotate: -8 }}
                                whileHover={{ scale: 1.05, rotate: -4, zIndex: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => setSelectedImage(images[1].src)}
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" />
                                </div>
                            </motion.div>

                            {/* Polaroid 2 */}
                            <motion.div 
                                className="absolute top-32 -left-8 lg:-left-12 w-56 bg-white p-3 pb-10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer z-10 hidden md:block"
                                initial={{ rotate: 6 }}
                                whileHover={{ scale: 1.05, rotate: 2, zIndex: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => setSelectedImage(images[2].src)}
                            >
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-5xl aspect-[3/2]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image 
                                src={selectedImage} 
                                alt="Imagem ampliada" 
                                fill 
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
