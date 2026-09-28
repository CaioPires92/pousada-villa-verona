import fs from "node:fs";
import path from "node:path";

import type { Metadata } from "next";

import GalleryGrid, { type GalleryPhoto } from "./GalleryGrid";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Galeria de fotos | Pousada Villa Verona",
  description: "Conheça os quartos, jardins, piscinas, áreas de lazer e o café da manhã da Pousada Villa Verona em Serra Negra.",
  path: "/galeria",
  image: "/fotos/areas-externas/849028896.jpg",
});

const PHOTO_GROUPS = [
  { directory: "areas-externas", label: "Áreas externas", prefix: "Área externa" },
  { directory: "quartos/triplo", label: "Quarto Triplo", prefix: "Quarto Triplo" },
  { directory: "quartos/quadruplo", label: "Quarto Quádruplo", prefix: "Quarto Quádruplo" },
  { directory: "quartos/quadruplo-comfort", label: "Quarto Comfort", prefix: "Quarto Quádruplo Comfort" },
  { directory: "quartos/familia", label: "Quarto Quíntuplo", prefix: "Quarto Quíntuplo" },
  { directory: "cafe-da-manha", label: "Café da manhã", prefix: "Café da manhã" },
  { directory: "sala-de-jogos", label: "Sala de jogos", prefix: "Sala de jogos" },
] as const;

function getGalleryPhotos(): GalleryPhoto[] {
  const publicPhotosDirectory = path.join(process.cwd(), "public", "fotos");
  const seenPhotoIds = new Set<string>();
  const photos: GalleryPhoto[] = [];

  for (const group of PHOTO_GROUPS) {
    const directory = path.join(publicPhotosDirectory, group.directory);
    const files = fs.readdirSync(directory)
      .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
      .sort((first, second) => first.localeCompare(second, "pt-BR", { numeric: true }));

    for (const file of files) {
      const photoId = path.parse(file).name;
      if (photoId === "835934771" || seenPhotoIds.has(photoId)) continue;
      seenPhotoIds.add(photoId);
      photos.push({
        src: `/fotos/${group.directory}/${file}`,
        alt: `${group.prefix} na Pousada Villa Verona`,
        category: group.label,
      });
    }
  }

  return photos;
}

export default function GalleryPage() {
  const photos = getGalleryPhotos();

  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <section className="px-4 pb-10 pt-16 text-center md:pb-12 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">Villa Verona</p>
        <h1 className="font-hero-display mt-3 text-4xl font-semibold text-brand-brown-dark md:text-6xl">Nossa Galeria</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/70 md:text-lg">
          Explore nossos quartos, áreas de lazer e todos os espaços preparados para a sua estadia em Serra Negra.
        </p>
      </section>

      <section className="mx-auto max-w-[92rem] px-4 pb-20 md:px-8">
        <GalleryGrid photos={photos} categories={PHOTO_GROUPS.map((group) => group.label)} />
      </section>
    </main>
  );
}
