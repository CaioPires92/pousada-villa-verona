"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, MessageCircle } from "lucide-react";

export default function MobileBookingBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState("2");

    useEffect(() => {
        const today = new Date();
        const checkinInit = today.toISOString().split('T')[0];
        const checkoutInit = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setCheckIn(checkinInit);
        setCheckOut(checkoutInit);
    }, []);

    const isExcludedPage = pathname.startsWith("/admin") || pathname.startsWith("/reservar");

    if (isExcludedPage) {
        return null;
    }
    
    const handleSimulate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.push(`/reservar?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="w-full bg-brand-brown-dark border-t border-brand-brown-red shadow-2xl relative">
                
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
                        <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                            <Calendar className="w-4 h-4 text-brand-gold" />
                            <div className="flex flex-col relative w-28">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-in</span>
                                <input 
                                    type="date" 
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer appearance-none"
                                />
                            </div>
                        </div>

                        {/* Check-out */}
                        <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                            <Calendar className="w-4 h-4 text-brand-gold" />
                            <div className="flex flex-col relative w-28">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-out</span>
                                <input 
                                    type="date" 
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer appearance-none"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-white/10 mx-2"></div>

                        {/* Adultos */}
                        <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                            <Users className="w-4 h-4 text-brand-gold" />
                            <div className="flex flex-col relative w-20">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Adultos</span>
                                <select 
                                    value={adults}
                                    onChange={(e) => setAdults(e.target.value)}
                                    className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer appearance-none w-full relative z-10"
                                >
                                    <option value="1" className="bg-brand-brown-dark">1 Adulto</option>
                                    <option value="2" className="bg-brand-brown-dark">2 Adultos</option>
                                    <option value="3" className="bg-brand-brown-dark">3 Adultos</option>
                                    <option value="4" className="bg-brand-brown-dark">4 Adultos</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Link
                        href="/reservar"
                        onClick={handleSimulate}
                        className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0 bg-brand-gold hover:opacity-90 transition-colors text-brand-brown-dark font-sans tracking-[0.15em] px-6 py-3.5 rounded-sm flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase cursor-pointer"
                    >
                        SIMULAR RESERVA <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
