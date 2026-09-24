"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, ArrowRight, MessageCircle } from "lucide-react";

export default function MobileBookingBar() {
    const pathname = usePathname();

    const isExcludedPage = pathname.startsWith("/admin") || pathname.startsWith("/reservar");

    if (isExcludedPage) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="w-full bg-[#3B4A3F] border-t border-[#4a5c4e] shadow-2xl relative">
                
                {/* Floating WhatsApp Button on the left */}
                <a 
                    href="https://wa.me/5519999002288" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute -top-6 left-4 md:left-12 lg:left-24 bg-[#25D366] hover:bg-[#20b858] transition-colors p-3.5 rounded-full shadow-lg z-50 flex items-center justify-center"
                    aria-label="Falar no WhatsApp"
                >
                    <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </a>

                <div className="container mx-auto px-16 lg:px-32 py-3 flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end lg:justify-center gap-2 md:gap-4 lg:gap-8">
                    
                    {/* Form Fields container */}
                    <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 lg:gap-8 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {/* Check-in */}
                        <div className="bg-[#4C5B50] rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5">
                            <Calendar className="w-4 h-4 text-[#d3b890]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Check-in</span>
                                <span className="text-sm text-white font-bold">24/09/2026</span>
                            </div>
                        </div>

                        {/* Check-out */}
                        <div className="bg-[#4C5B50] rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5">
                            <Calendar className="w-4 h-4 text-[#d3b890]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Check-out</span>
                                <span className="text-sm text-white font-bold">26/09/2026</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-white/10 mx-2"></div>

                        {/* Adultos */}
                        <div className="bg-[#4C5B50] rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5">
                            <Users className="w-4 h-4 text-[#d3b890]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Adultos</span>
                                <span className="text-sm text-white font-bold">2 Adultos</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Link
                        href="/reservar"
                        className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0 bg-[#d3b890] hover:bg-[#c4a67e] transition-colors text-[#2C4A3B] px-6 py-3.5 rounded-sm flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase"
                    >
                        SIMULAR RESERVA <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
