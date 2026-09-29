"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type GalleryPhoto = {
  alt: string;
  category: string;
  src: string;
};

type GalleryGridProps = {
  categories: string[];
  photos: GalleryPhoto[];
  showFilters?: boolean;
};

export default function GalleryGrid({ categories, photos, showFilters = true }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visiblePhotos = useMemo(
    () => activeCategory === "Todas" ? photos : photos.filter((photo) => photo.category === activeCategory),
    [activeCategory, photos],
  );

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % visiblePhotos.length);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + visiblePhotos.length) % visiblePhotos.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, visiblePhotos.length]);

  const showPrevious = () => setSelectedIndex((current) => current === null ? null : (current - 1 + visiblePhotos.length) % visiblePhotos.length);
  const showNext = () => setSelectedIndex((current) => current === null ? null : (current + 1) % visiblePhotos.length);

  return (
    <>
      {showFilters ? <div className="scrollbar-hide -mx-4 mb-7 flex snap-x gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mb-10 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
        {["Todas", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setSelectedIndex(null);
            }}
            className={`shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
              activeCategory === category
                ? "border-brand-brown-dark bg-brand-brown-dark text-white"
                : "border-brand-brown-dark/15 bg-white text-brand-brown-dark hover:border-brand-gold hover:text-brand-gold"
            }`}
          >
            {category}
          </button>
        ))}
      </div> : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-brown-dark/5 text-left shadow-[0_8px_24px_rgba(40,50,35,0.08)]"
            aria-label={`Ampliar: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
              {photo.category}
            </span>
          </button>
        ))}
      </div>

      {selectedIndex !== null && visiblePhotos[selectedIndex] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${visiblePhotos[selectedIndex].alt}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 md:p-10"
          onClick={() => setSelectedIndex(null)}
        >
          <button type="button" aria-label="Fechar galeria" onClick={() => setSelectedIndex(null)} className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
            <X size={26} />
          </button>
          <button type="button" aria-label="Foto anterior" onClick={(event) => { event.stopPropagation(); showPrevious(); }} className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-8">
            <ChevronLeft size={30} />
          </button>
          <div className="relative h-[82vh] w-[88vw]" onClick={(event) => event.stopPropagation()}>
            <Image src={visiblePhotos[selectedIndex].src} alt={visiblePhotos[selectedIndex].alt} fill sizes="90vw" quality={90} className="object-contain" priority />
          </div>
          <button type="button" aria-label="Próxima foto" onClick={(event) => { event.stopPropagation(); showNext(); }} className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-8">
            <ChevronRight size={30} />
          </button>
          <div className="absolute bottom-4 text-sm text-white/80">
            {selectedIndex + 1} / {visiblePhotos.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
