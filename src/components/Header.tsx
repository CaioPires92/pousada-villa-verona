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
        { href: "/a-reserva-mantiqueira", label: "A RESERVA MANTIQUEIRA" },
        { href: "/acomodacoes", label: "ACOMODAÇÕES", hasDropdown: true },
        { href: "/galeria", label: "GALERIA" },
        { href: "/serra-negra", label: "SERRA NEGRA" },
        { href: "/contato", label: "CONTATO" },
    ];

    if (pathname.startsWith('/admin')) return null;

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-[#F9F9F7] shadow-sm">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo Area */}
                    <div className="h-full flex items-start">
                        <Link
                            href="/"
                            aria-label="Ir para a página inicial"
                            className="relative h-24 w-32 md:h-32 md:w-44 bg-[#2C4A3B] rounded-b-xl flex items-center justify-center p-4 transition-transform hover:scale-105 z-10 shadow-lg"
                        >
                            <Image
                                src="/fotos/logo.png"
                                alt="Reserva Mantiqueira"
                                fill
                                sizes="(max-width: 768px) 100vw, 160px"
                                className="object-contain p-2"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => (
                            <div key={`${link.href}-${link.label}`} className="flex items-center">
                                <Link
                                    href={link.href}
                                    className="text-xs xl:text-sm font-semibold tracking-widest text-[#4A4A4A] hover:text-[#2C4A3B] transition-colors flex items-center gap-1"
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
                            className="bg-[#2C4A3B] hover:bg-[#1f3529] text-white rounded-none h-12 px-6 lg:px-8 text-xs font-semibold tracking-wider flex items-center gap-2"
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
                        className="lg:hidden p-2 text-[#4A4A4A]"
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
                                className="block text-[#4A4A4A] font-semibold text-sm tracking-widest hover:text-[#2C4A3B] transition-colors py-2 border-b border-gray-100 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="flex items-center justify-between">
                                    {link.label}
                                    {link.hasDropdown && <ChevronDown size={16} />}
                                </div>
                            </Link>
                        ))}
                        <Button asChild className="w-full bg-[#2C4A3B] hover:bg-[#1f3529] text-white rounded-none h-12 flex items-center justify-center gap-2 mt-4">
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
