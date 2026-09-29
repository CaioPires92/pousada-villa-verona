"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { trackClickReservar } from "@/lib/analytics";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "HOME" },
        { href: "/a-pousada", label: "A POUSADA VILLA VERONA" },
        { href: "/acomodacoes", label: "ACOMODAÇÕES", hasDropdown: true },
        { href: "/galeria", label: "GALERIA" },
        { href: "/serra-negra", label: "SERRA NEGRA" },
        { href: "/contato", label: "CONTATO" },
    ];

    if (pathname.startsWith('/admin')) return null;

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[#F9F9F7] shadow-sm">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between md:h-24">
                    {/* Logo Area */}
                    <div className="relative flex h-full w-20 items-start md:w-28">
                        <Link
                            href="/"
                            aria-label="Ir para a página inicial"
                            className="absolute left-0 top-0 z-50 flex h-20 w-20 items-center justify-center overflow-hidden rounded-b-[1rem] border border-t-0 border-brand-brown-dark/20 bg-brand-gold p-2 shadow-lg transition-transform hover:scale-105 md:h-32 md:w-28 md:rounded-b-[1.2rem]"
                        >
                            <Image
                                src="/logo.png"
                                alt="Pousada Villa Verona"
                                fill
                                sizes="(max-width: 768px) 80px, 112px"
                                className="object-contain object-center scale-110 md:scale-125"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <div key={`${link.href}-${link.label}`} className="flex items-center">
                                <Link
                                    href={link.href}
                                    className="text-xs xl:text-sm font-normal tracking-[0.15em] text-brand-brown-dark hover:text-brand-gold transition-colors flex items-center gap-1"
                                >
                                    {link.label}
                                    {link.hasDropdown && <ChevronDown size={14} className="opacity-70" />}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex">
                        <Button
                            asChild
                            className="bg-brand-brown-dark hover:bg-brand-brown-red text-white rounded-none h-12 px-6 lg:px-8 text-xs font-semibold tracking-wider flex items-center gap-2"
                        >
                            <Link href="/reservar" onClick={() => trackClickReservar('header_desktop')}>
                                FAÇA SUA RESERVA <ChevronRight size={16} />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        className="lg:hidden flex h-11 w-11 items-center justify-center text-brand-brown-dark"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav id="mobile-navigation" aria-label="Navegação mobile" className="lg:hidden absolute top-full left-0 right-0 bg-[#F9F9F7] border-t border-gray-200 shadow-lg px-4 pb-6 pt-2 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={`${link.href}-${link.label}`}
                                href={link.href}
                                className="block text-brand-brown-dark font-semibold text-sm tracking-widest hover:text-brand-gold transition-colors py-2 border-b border-gray-100 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="flex items-center justify-between">
                                    {link.label}
                                    {link.hasDropdown && <ChevronDown size={16} />}
                                </div>
                            </Link>
                        ))}
                        <Button asChild className="w-full bg-brand-brown-dark hover:bg-brand-brown-red text-white rounded-none h-12 flex items-center justify-center gap-2 mt-4">
                            <Link href="/reservar" onClick={() => { trackClickReservar('header_mobile'); setIsMobileMenuOpen(false); }}>
                                FAÇA SUA RESERVA <ChevronRight size={16} />
                            </Link>
                        </Button>
                    </nav>
                )}
            </div>
        </header>
    );
}
