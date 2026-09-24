"use client";

import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#3B4A3F] text-white py-12 md:py-16">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-between items-start mb-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="relative h-32 w-32 md:h-40 md:w-40">
                            <Image
                                src="/fotos/logo.png"
                                alt="Reserva Mantiqueira"
                                fill
                                sizes="(max-width: 768px) 128px, 160px"
                                className="object-contain object-left"
                            />
                        </div>
                    </div>

                    {/* Navegação */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold tracking-widest text-white/60 mb-6 uppercase">Navegação</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/a-reserva-mantiqueira", label: "A Reserva Mantiqueira" },
                                { href: "/acomodacoes", label: "Acomodações" },
                                { href: "/galeria", label: "Galeria" },
                                { href: "/serra-negra", label: "Serra Negra" },
                                { href: "/contato", label: "Contato" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white/70 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Experiências */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold tracking-widest text-white/60 mb-6 uppercase">Experiências</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { href: "/cabana-boutique", label: "Cabana Boutique" },
                                { href: "/casa-vista", label: "Casa Vista" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white hover:text-white/70 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Atendimento */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold tracking-widest text-white/60 mb-6 uppercase">Atendimento</h4>
                        <ul className="space-y-5 text-sm font-medium">
                            <li className="flex items-start gap-4 text-white">
                                <div className="p-2 border border-white/20 rounded-full flex-shrink-0 mt-1">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Reserva via Email</p>
                                    <a href="mailto:reservas@reservamantiqueiracabana.com.br" className="hover:text-white/70 transition-colors">
                                        reservas@reservamantiqueiracabana.com.br
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-white">
                                <div className="p-2 border border-white/20 rounded-full flex-shrink-0 mt-1">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">WhatsApp Concierge</p>
                                    <a href="https://wa.me/5519999040040" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
                                        (19) 99904-0040
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-white">
                                <div className="p-2 border border-white/20 rounded-full flex-shrink-0 mt-1">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Localização</p>
                                    <p>Serra Negra, SP</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-white/60 font-medium">
                    <p>
                        © {currentYear} Reserva Mantiqueira. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <p>
                            DESENVOLVIDO POR TRRWEB
                        </p>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-white">
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
