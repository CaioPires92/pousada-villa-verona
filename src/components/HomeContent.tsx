"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchWidget from "@/components/SearchWidget";
import { ArrowLeft, ArrowRight, CalendarCheck2, Coffee, Trees, Waves } from "lucide-react";
import {
  gaEvent,
  trackClickReservarHero,
  trackClickReservarFinal,
  trackClickWhatsAppFinal,
} from "@/lib/analytics";
import { formatDateBRFromYmd } from "@/lib/date";
import SocialProofBadges from "@/components/SocialProofBadges";
import Testimonials from "@/components/Testimonials";

import type { HomeOfferSummary } from "@/components/HomeAvailabilityOffers";

const HomeAvailabilityOffers = dynamic(() => import("@/components/HomeAvailabilityOffers"), {
  loading: () => <section aria-label="Ofertas disponíveis" className="min-h-[420px] bg-white" />,
});
const SpecialDatesSection = dynamic(() => import("@/components/SpecialDatesSection"));
import {
  SPECIAL_DATES,
} from "@/constants/specialDates";

const siteImages = {
  hero: {
    src: "/fotos/piscina-aptos/DJI_0845.jpg",
    alt: "Piscina da Pousada Delplata em Serra Negra",
  },
  accommodations: {
    mainWing: {
      src: "/fotos/ala-principal/apartamentos/superior/DSC_0069-1200.webp",
      alt: "Ala Principal da Pousada Delplata",
    },
    annexWing: {
      src: "/fotos/ala-chales/chales/IMG_0125-1200.webp",
      alt: "Ala Chalés e Anexos da Pousada Delplata",
    },
  },
  leisure: {
    src: "/fotos/piscina-aptos/DJI_0863.jpg",
    alt: "Área de lazer com piscina",
  },
  breakfast: {
    src: "/fotos/restaurante/DSC_0056.jpg",
    alt: "Café da manhã da pousada",
  },
  experiences: {
    pool: {
      src: "/fotos/piscina-aptos/DJI_0863.jpg",
      alt: "Piscina da Pousada Delplata",
    },
    breakfast: {
      src: "/fotos/restaurante/IMG_0025.webp",
      alt: "Mesa de café da manhã da Pousada Delplata",
    },
    family: {
      src: "/fotos/jardim-aptos/DJI_0904.jpg",
      alt: "Área verde da Pousada Delplata para famílias",
    },
    nature: {
      src: "/fotos/jardim-aptos/DSC_0267.jpg",
      alt: "Jardins da Pousada Delplata em Serra Negra",
    },
  },
  cta: {
    src: "/fotos/piscina-aptos/DJI_0908.jpg",
    alt: "Vista da área da piscina para reserva",
  },
  galleryPages: [
    {
      title: "Piscina e hotel",
      images: [
        { src: "/fotos/piscina-aptos/DJI_0863.jpg", alt: "Piscina da pousada" },
        { src: "/fotos/piscina-aptos/DJI_0864.jpg", alt: "Vista aérea da piscina" },
        { src: "/fotos/piscina-aptos/DJI_0900.jpg", alt: "Piscina e estrutura da pousada" },
        { src: "/fotos/piscina-aptos/DJI_0908.jpg", alt: "Vista da piscina com hotel ao fundo" },
        { src: "/fotos/jardim-aptos/DJI_0889.jpg", alt: "Área externa do hotel" },
        { src: "/fotos/jardim-aptos/DJI_0896.jpg", alt: "Vista do hotel e jardins" },
      ],
    },
    {
      title: "Piscina dos chalés",
      images: [
        { src: "/fotos/piscina-chale/DJI_0916.jpg", alt: "Piscina da área dos chalés" },
        { src: "/fotos/piscina-chale/DJI_0917.jpg", alt: "Vista da piscina dos chalés" },
        { src: "/fotos/piscina-chale/DJI_0918.jpg", alt: "Piscina próxima aos chalés" },
        { src: "/fotos/piscina-chale/DSC_0370.jpg", alt: "Detalhe da piscina dos chalés" },
        { src: "/fotos/piscina-chale/DSC_0374.jpg", alt: "Área de lazer da piscina dos chalés" },
        { src: "/fotos/piscina-chale/DSC_0380.jpg", alt: "Piscina da ala de chalés" },
      ],
    },
    {
      title: "Churrasqueiras",
      images: [
        { src: "/fotos/churrasqueira-aptos/DJI_0902.jpg", alt: "Churrasqueira da área dos apartamentos" },
        { src: "/fotos/churrasqueira-aptos/DSC_0269.jpg", alt: "Área de churrasqueira dos apartamentos" },
        { src: "/fotos/churrasqueira-aptos/DSC_0273.jpg", alt: "Espaço de churrasqueira da pousada" },
        { src: "/fotos/churrasqueira-chale/DJI_0920.jpg", alt: "Churrasqueira próxima aos chalés" },
        { src: "/fotos/churrasqueira-chale/DSC_0394.jpg", alt: "Área de churrasqueira dos chalés" },
        { src: "/fotos/churrasqueira-chale/DSC_0396.jpg", alt: "Detalhe da churrasqueira da ala de chalés" },
      ],
    },
    {
      title: "Jardins",
      images: [
        { src: "/fotos/jardim-aptos/DJI_0903.jpg", alt: "Vista dos jardins da pousada" },
        { src: "/fotos/jardim-aptos/DJI_0904.jpg", alt: "Área verde da pousada" },
        { src: "/fotos/jardim-aptos/DSC_0258.jpg", alt: "Jardins e área externa" },
        { src: "/fotos/jardim-aptos/DSC_0262.jpg", alt: "Caminho pelos jardins" },
        { src: "/fotos/jardim-aptos/DSC_0267.jpg", alt: "Jardins da pousada em Serra Negra" },
        { src: "/fotos/jardim-aptos/DSC_0275.jpg", alt: "Área verde e paisagismo da pousada" },
      ],
    },
    {
      title: "Sala de jogos",
      images: [
        { src: "/fotos/Sala de jogos/DSC_0228.jpg", alt: "Sala de jogos da pousada" },
        { src: "/fotos/Sala de jogos/DSC_0232.jpg", alt: "Área interna da sala de jogos" },
        { src: "/fotos/Sala de jogos/DSC_0333.jpg", alt: "Mesa e ambiente da sala de jogos" },
        { src: "/fotos/Sala de jogos/DSC_0334.jpg", alt: "Vista da sala de jogos" },
        { src: "/fotos/Sala de jogos/DSC_0337.jpg", alt: "Detalhes da sala de jogos" },
        { src: "/fotos/Sala de jogos/DSC_0346.jpg", alt: "Espaço de lazer com jogos" },
      ],
    },
    {
      title: "Barzinho",
      images: [
        { src: "/fotos/bar-principal/DJI_0893.jpg", alt: "Vista do bar principal da pousada" },
        { src: "/fotos/bar-principal/DSC_0256.jpg", alt: "Ambiente do barzinho" },
        { src: "/fotos/bar-principal/DSC_0276.jpg", alt: "Bar principal da pousada" },
        { src: "/fotos/bar-principal/DSC_0349.jpg", alt: "Detalhes do bar principal" },
        { src: "/fotos/bar-principal/porcoes/DSC_0279.jpg", alt: "Porções servidas no barzinho" },
        { src: "/fotos/bar-principal/porcoes/IMG_6983.jpg", alt: "Petiscos e porções do barzinho" },
      ],
    },
  ],
} as const;

export default function HomeContent() {
  /* Removed GSAP refs and effects to fix re-render flash */
  /* Using purely Framer Motion for stable SSR/Hydration */

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const experienceBenefits = [
    {
      title: "Piscina",
      description: "Piscinas para adultos e crianças nas áreas de lazer da pousada.",
      icon: Waves,
    },
    {
      title: "Café da manhã diário",
      description: "Café da manhã servido diariamente durante a hospedagem.",
      icon: Coffee,
    },
    {
      title: "Ambiente familiar",
      description: "Ambiente destinado a estadias de casais e famílias.",
      icon: Trees,
    },
    {
      title: "Reserva pelo site",
      description: "Consulte disponibilidade e valores antes de escolher sua acomodação.",
      icon: CalendarCheck2,
    },
  ] as const;

  const WHATSAPP_PHONE = "5519999654866";
  const WHATSAPP_MESSAGE = "Olá! Tenho uma dúvida sobre a hospedagem. Já consultei no site, pode me ajudar?";
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const [activeGalleryPage, setActiveGalleryPage] = useState(0);
  const [lowestOffer, setLowestOffer] = useState<HomeOfferSummary | null>(null);
  const handleLowestOfferChange = useCallback((summary: HomeOfferSummary | null) => {
    setLowestOffer(summary);
  }, []);
  const enabledSpecialDates = useMemo(
    () => SPECIAL_DATES.filter((specialDate) => specialDate.enabled),
    []
  );
  const currentGalleryPage = siteImages.galleryPages[activeGalleryPage];

  const handleSpecialDateClick = (specialDateId: string) => {
    gaEvent("home_special_dates_click", { special_date_id: specialDateId });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section data-home-hero className="relative flex min-h-screen min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[color:var(--brand-black)]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={siteImages.hero.src}
            alt={siteImages.hero.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            quality={75}
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          className="container relative z-10 flex flex-col items-center text-center mt-20"
          initial={false}
          animate="visible"
          variants={containerVariants}
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-brand-gold mb-4"
          >
            SOFISTICAÇÃO & CONFORTO
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-white mb-6 tracking-wide drop-shadow-md"
          >
            POUSADA VILLA VERONA
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-white/90 font-light max-w-2xl"
          >
            Acomodações privativas para dias de total exclusividade
          </motion.p>
        </motion.div>
      </section>

      <HomeAvailabilityOffers onLowestOfferChange={handleLowestOfferChange} />

      {/* Depoimentos */}
      <Testimonials />

      {/* Galeria */}
      <section className="section-space-md bg-[color:var(--brand-cream)] text-brand-brown-dark">
        <div className="container">
          <div className="mb-12 flex flex-col gap-6 text-center md:mb-16 md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <p className="font-accent text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-gold md:text-[0.8rem]">
                Galeria
              </p>
              <h2 className="font-hero-display mt-4 text-[2.4rem] leading-tight md:text-[3.2rem]">
                Nossa pousada em imagens
              </h2>
              <p className="mt-3 font-sans text-[0.98rem] leading-7 text-brand-brown-dark/72">
                {currentGalleryPage.title}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 md:justify-end">
              <button
                type="button"
                aria-label="Ver grupo anterior de fotos"
                onClick={() =>
                  setActiveGalleryPage((current) =>
                    current === 0 ? siteImages.galleryPages.length - 1 : current - 1
                  )
                }
                className="inline-flex h-12 w-12 items-center justify-center rounded-none border border-brand-brown-dark/15 bg-[color:var(--brand-white)] text-brand-brown-dark transition-colors duration-200 hover:bg-[color:var(--brand-cream)]"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label="Ver próximo grupo de fotos"
                onClick={() =>
                  setActiveGalleryPage((current) =>
                    current === siteImages.galleryPages.length - 1 ? 0 : current + 1
                  )
                }
                className="inline-flex h-12 w-12 items-center justify-center rounded-none border border-brand-brown-dark/15 bg-[color:var(--brand-white)] text-brand-brown-dark transition-colors duration-200 hover:bg-[color:var(--brand-cream)]"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
          <div key={currentGalleryPage.title} className="mx-auto grid max-w-[82rem] grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {currentGalleryPage.images.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden border border-brand-brown-dark/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Dates Section */}
      <ContactAndLocation />

      {/* Special Dates Section */}
      <SpecialDatesSection
        dates={enabledSpecialDates}
        onDateClick={(specialDate) => handleSpecialDateClick(specialDate.id)}
      />

          </main>
  );
}
