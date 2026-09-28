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
import ContactAndLocation from "./ContactAndLocation";
import {
  SPECIAL_DATES,
} from "@/constants/specialDates";

const siteImages = {
  hero: {
    src: "/fotos/areas-externas/849028896.jpg",
    alt: "Piscina da Pousada Villa Verona em Serra Negra",
  },
  accommodations: {
    mainWing: {
      src: "/fotos/quartos/triplo/849059556.jpg",
      alt: "Quarto Triplo da Pousada Villa Verona",
    },
    annexWing: {
      src: "/fotos/quartos/familia/849062686.jpg",
      alt: "Quarto Quíntuplo da Pousada Villa Verona",
    },
  },
  leisure: {
    src: "/fotos/areas-externas/881575120.jpg",
    alt: "Área de lazer com piscina",
  },
  breakfast: {
    src: "/fotos/cafe-da-manha/791641806.jpg",
    alt: "Café da manhã da pousada",
  },
  experiences: {
    pool: {
      src: "/fotos/areas-externas/881575120.jpg",
      alt: "Piscina da Pousada Villa Verona",
    },
    breakfast: {
      src: "/fotos/cafe-da-manha/791641805.jpg",
      alt: "Mesa de café da manhã da Pousada Villa Verona",
    },
    family: {
      src: "/fotos/areas-externas/849034796.jpg",
      alt: "Área verde da Pousada Villa Verona para famílias",
    },
    nature: {
      src: "/fotos/areas-externas/849035185.jpg",
      alt: "Jardins da Pousada Villa Verona em Serra Negra",
    },
  },
  cta: {
    src: "/fotos/areas-externas/849034797.jpg",
    alt: "Vista da área da piscina para reserva",
  },
  galleryPages: [
    {
      title: "Piscina e áreas externas",
      images: [
        { src: "/fotos/areas-externas/849028896.jpg", alt: "Vista aérea da piscina" },
        { src: "/fotos/areas-externas/881575120.jpg", alt: "Piscina da pousada" },
        { src: "/fotos/areas-externas/881575135.jpg", alt: "Piscina e jardins" },
        { src: "/fotos/areas-externas/849034797.jpg", alt: "Vista aérea da pousada" },
        { src: "/fotos/areas-externas/849035180.jpg", alt: "Área verde da pousada" },
        { src: "/fotos/areas-externas/849035185.jpg", alt: "Pôr do sol na propriedade" },
      ],
    },
    {
      title: "Jardins e natureza",
      images: [
        { src: "/fotos/areas-externas/849035415.jpg", alt: "Gramado e jardins" },
        { src: "/fotos/areas-externas/849034796.jpg", alt: "Área verde e parquinho" },
        { src: "/fotos/areas-externas/791712290.jpg", alt: "Lago da pousada" },
        { src: "/fotos/areas-externas/791712277.jpg", alt: "Lago e roda d'água" },
        { src: "/fotos/areas-externas/881575151.jpg", alt: "Pergolado no jardim" },
        { src: "/fotos/areas-externas/881575153.jpg", alt: "Redes no jardim" },
      ],
    },
    {
      title: "Lazer ao ar livre",
      images: [
        { src: "/fotos/areas-externas/849030894.jpg", alt: "Campo de futebol" },
        { src: "/fotos/areas-externas/849032553.jpg", alt: "Quadra esportiva" },
        { src: "/fotos/areas-externas/881575127.jpg", alt: "Quadra de vôlei" },
        { src: "/fotos/areas-externas/881575145.jpg", alt: "Área de areia para esportes" },
        { src: "/fotos/areas-externas/881575149.jpg", alt: "Parquinho infantil" },
        { src: "/fotos/areas-externas/849036361.jpg", alt: "Redes para descanso" },
      ],
    },
    {
      title: "Café da manhã",
      images: [
        { src: "/fotos/cafe-da-manha/791641807.jpg", alt: "Bolo servido no café da manhã" },
        { src: "/fotos/cafe-da-manha/791641806.jpg", alt: "Mesa de café da manhã" },
        { src: "/fotos/cafe-da-manha/791641805.jpg", alt: "Pães e quitutes do café da manhã" },
        { src: "/fotos/cafe-da-manha/791641804.jpg", alt: "Buffet de café da manhã" },
        { src: "/fotos/cafe-da-manha/791641795.jpg", alt: "Frutas e bebidas do café da manhã" },
        { src: "/fotos/cafe-da-manha/881575157.jpg", alt: "Café da manhã da pousada" },
      ],
    },
    {
      title: "Sala de jogos",
      images: [
        { src: "/fotos/sala-de-jogos/881575082.jpg", alt: "Sala de jogos da pousada" },
        { src: "/fotos/sala-de-jogos/672531136.jpg", alt: "Mesa de bilhar e pebolim" },
        { src: "/fotos/sala-de-jogos/672531128.jpg", alt: "Tênis de mesa e jogos" },
        { src: "/fotos/sala-de-jogos/881575079.jpg", alt: "Espaço infantil" },
        { src: "/fotos/sala-de-jogos/881575100.jpg", alt: "Mesa de tênis de mesa" },
        { src: "/fotos/sala-de-jogos/881575132.jpg", alt: "Área de jogos" },
      ],
    },
    {
      title: "Acomodações",
      images: [
        { src: "/fotos/quartos/triplo/849059556.jpg", alt: "Quarto Triplo" },
        { src: "/fotos/quartos/triplo/881559363.jpg", alt: "Quarto Triplo da pousada" },
        { src: "/fotos/quartos/quadruplo/849061453.jpg", alt: "Quarto Quádruplo" },
        { src: "/fotos/quartos/quadruplo/883982181.jpg", alt: "Quarto Quádruplo da pousada" },
        { src: "/fotos/quartos/quadruplo-comfort/883982350.jpg", alt: "Quarto Quádruplo Comfort" },
        { src: "/fotos/quartos/familia/849062686.jpg", alt: "Quarto Quíntuplo" },
      ],
    },
  ],
} as const;

export default function HomeContent({ hotelConfig }: { hotelConfig?: any }) {
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

  const WHATSAPP_PHONE = "5519999002288";
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
            quality={90}
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
      <ContactAndLocation hotelConfig={hotelConfig} />

      {/* Special Dates Section */}
      <SpecialDatesSection
        dates={enabledSpecialDates}
        onDateClick={(specialDate) => handleSpecialDateClick(specialDate.id)}
      />

          </main>
  );
}
