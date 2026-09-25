import type { Metadata } from "next";
import { Suspense } from "react";

import HomeContent from "@/components/HomeContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
    title: "Pousada em Serra Negra com piscina e café da manhã | Pousada Villa Verona",
    description:
        "Hospede-se em Serra Negra com conforto, lazer para a família, café da manhã e reserva online no site oficial da Pousada Villa Verona.",
    path: "/",
    keywords: [
        "pousada em Serra Negra",
        "hotel em Serra Negra",
        "site oficial pousada Serra Negra",
        "pousada familiar em Serra Negra",
    ],
});

export default function HomePage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[color:var(--brand-cream)]" />}>
            <HomeContent hotelConfig={{
                name: process.env.HOTEL_NAME || "Pousada",
                email: process.env.HOTEL_EMAIL || process.env.CONTACT_RECEIVER_EMAIL || "reservas@villaverona.com.br",
                whatsapp: process.env.NEXT_PUBLIC_HOTEL_WHATSAPP || process.env.HOTEL_WHATSAPP || "551938422559",
                whatsappLink: process.env.NEXT_PUBLIC_HOTEL_WHATSAPP_LINK || process.env.HOTEL_WHATSAPP_LINK || "https://wa.me/551938422559",
                address: process.env.HOTEL_ADDRESS || "Serra Negra - SP"
            }} />
        </Suspense>
    );
}
