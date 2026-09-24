"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, MessageCircle, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

export default function MobileBookingBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [checkIn, setCheckIn] = useState<Date | undefined>();
    const [checkOut, setCheckOut] = useState<Date | undefined>();
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
        setCheckIn(today);
        setCheckOut(tomorrow);
    }, []);

    const isExcludedPage = pathname.startsWith("/admin") || pathname.startsWith("/reservar");

    if (isExcludedPage) {
        return null;
    }
    
    const handleSimulate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const ci = checkIn ? format(checkIn, 'yyyy-MM-dd') : '';
        const co = checkOut ? format(checkOut, 'yyyy-MM-dd') : '';
        router.push(`/reservar?checkin=${ci}&checkout=${co}&adults=${adults}&children=${children}`);
    };

    const calendarClassNames = {
        caption_label: "text-white font-semibold text-sm",
        head_cell: "text-white/70 font-medium text-[0.7rem] uppercase tracking-wide w-full text-center py-1",
        day: "h-9 w-9 p-0 font-normal text-white hover:bg-white/10 rounded-lg mx-auto",
        day_selected: "bg-brand-gold text-brand-brown-dark font-bold hover:bg-brand-gold/90 hover:text-brand-brown-dark focus:bg-brand-gold focus:text-brand-brown-dark",
        day_today: "bg-white/5 text-white font-bold",
        nav_button: "h-7 w-7 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center rounded-md"
    };

    const guestsLabel = `${adults} Ad${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Cr` : ''}`;

    return (
        <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="w-full bg-brand-brown-dark border-t border-brand-brown-red shadow-2xl relative">
                
                <div className="container mx-auto px-4 sm:px-16 lg:px-32 py-3 flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end lg:justify-center gap-2 md:gap-4 lg:gap-8">
                    
                    {/* Form Fields container */}
                    <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 lg:gap-8 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        
                        {/* Check-in */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                                    <Calendar className="w-4 h-4 text-brand-gold" />
                                    <div className="flex flex-col relative w-24 sm:w-28">
                                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-in</span>
                                        <span className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full appearance-none">
                                            {checkIn ? format(checkIn, "dd/MM/yy") : "Selecione"}
                                        </span>
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[60] bg-brand-brown-dark border-brand-brown-red shadow-2xl" align="start">
                                <CalendarUI
                                    mode="single"
                                    selected={checkIn}
                                    onSelect={setCheckIn}
                                    initialFocus
                                    locale={ptBR}
                                    className="bg-brand-brown-dark text-white border-none"
                                    classNames={calendarClassNames}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Check-out */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                                    <Calendar className="w-4 h-4 text-brand-gold" />
                                    <div className="flex flex-col relative w-24 sm:w-28">
                                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-out</span>
                                        <span className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full appearance-none">
                                            {checkOut ? format(checkOut, "dd/MM/yy") : "Selecione"}
                                        </span>
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[60] bg-brand-brown-dark border-brand-brown-red shadow-2xl" align="start">
                                <CalendarUI
                                    mode="single"
                                    selected={checkOut}
                                    onSelect={setCheckOut}
                                    initialFocus
                                    locale={ptBR}
                                    className="bg-brand-brown-dark text-white border-none"
                                    classNames={calendarClassNames}
                                />
                            </PopoverContent>
                        </Popover>

                        <div className="hidden md:block w-px h-10 bg-white/10 mx-2"></div>

                        {/* Hóspedes (Adultos & Crianças) */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                                    <Users className="w-4 h-4 text-brand-gold" />
                                    <div className="flex flex-col relative min-w-[70px] sm:min-w-[100px]">
                                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Hóspedes</span>
                                        <span className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full appearance-none whitespace-nowrap">
                                            {guestsLabel}
                                        </span>
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] sm:w-[340px] p-6 z-[60] bg-brand-brown-dark border-brand-brown-red shadow-2xl" align="end">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Configurar Ocupação</h4>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            Até 4 hóspedes por quarto. Crianças de 0 a 5 anos não pagam, mas contam na ocupação.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Adultos */}
                                        <div className="flex items-center justify-between p-4 bg-brand-brown-red rounded-sm border border-white/5">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">Adultos</p>
                                                <p className="text-xs text-white/60">A partir de 12 anos</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setAdults(Math.max(1, adults - 1))}
                                                    disabled={adults <= 1}
                                                    className="w-8 h-8 flex items-center justify-center border border-white/20 bg-brand-brown-dark rounded hover:border-brand-gold text-white hover:text-brand-gold transition-colors disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:text-white"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-4 text-center font-bold text-white">{adults}</span>
                                                <button 
                                                    onClick={() => setAdults(Math.min(4, adults + 1))}
                                                    disabled={adults >= 4 || (adults + children >= 4)}
                                                    className="w-8 h-8 flex items-center justify-center border border-white/20 bg-brand-brown-dark rounded hover:border-brand-gold text-white hover:text-brand-gold transition-colors disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:text-white"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Crianças */}
                                        <div className="flex items-center justify-between p-4 bg-brand-brown-red rounded-sm border border-white/5">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">Crianças</p>
                                                <p className="text-xs text-white/60">Até 11 anos</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                                    disabled={children <= 0}
                                                    className="w-8 h-8 flex items-center justify-center border border-white/20 bg-brand-brown-dark rounded hover:border-brand-gold text-white hover:text-brand-gold transition-colors disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:text-white"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-4 text-center font-bold text-white">{children}</span>
                                                <button 
                                                    onClick={() => setChildren(Math.min(3, children + 1))}
                                                    disabled={children >= 3 || (adults + children >= 4)}
                                                    className="w-8 h-8 flex items-center justify-center border border-white/20 bg-brand-brown-dark rounded hover:border-brand-gold text-white hover:text-brand-gold transition-colors disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:text-white"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
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
