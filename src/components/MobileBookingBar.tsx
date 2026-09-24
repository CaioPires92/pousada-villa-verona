"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Users, ArrowRight, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MobileBookingBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [checkIn, setCheckIn] = useState<Date | undefined>();
    const [checkOut, setCheckOut] = useState<Date | undefined>();
    const [adults, setAdults] = useState("2");

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
        router.push(`/reservar?checkin=${ci}&checkout=${co}&adults=${adults}`);
    };

    const calendarClassNames = {
        caption_label: "text-white font-semibold text-sm",
        head_cell: "text-white/70 font-medium text-[0.7rem] uppercase tracking-wide w-full text-center py-1",
        day: "h-9 w-9 p-0 font-normal text-white hover:bg-white/10 rounded-lg mx-auto",
        day_selected: "bg-brand-gold text-brand-brown-dark font-bold hover:bg-brand-gold/90 hover:text-brand-brown-dark focus:bg-brand-gold focus:text-brand-brown-dark",
        day_today: "bg-white/5 text-white font-bold",
        nav_button: "h-7 w-7 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center rounded-md"
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-40">
            <div className="w-full bg-brand-brown-dark border-t border-brand-brown-red shadow-2xl relative">
                
                

                <div className="container mx-auto px-16 lg:px-32 py-3 flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end lg:justify-center gap-2 md:gap-4 lg:gap-8">
                    
                    {/* Form Fields container */}
                    <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 lg:gap-8 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        
                        {/* Check-in */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                                    <Calendar className="w-4 h-4 text-brand-gold" />
                                    <div className="flex flex-col relative w-28">
                                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-in</span>
                                        <span className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full appearance-none">
                                            {checkIn ? format(checkIn, "dd/MM/yyyy") : "Selecione"}
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
                                    <div className="flex flex-col relative w-28">
                                        <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Check-out</span>
                                        <span className="bg-transparent text-sm text-white font-bold outline-none cursor-pointer w-full appearance-none">
                                            {checkOut ? format(checkOut, "dd/MM/yyyy") : "Selecione"}
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

                        {/* Adultos */}
                        <div className="bg-brand-brown-red rounded-sm px-4 py-2 flex items-center gap-3 min-w-max border border-white/5 relative group cursor-pointer focus-within:ring-1 focus-within:ring-brand-gold">
                            <Users className="w-4 h-4 text-brand-gold" />
                            <div className="flex flex-col relative w-[100px]">
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">Adultos</span>
                                <Select value={adults} onValueChange={setAdults}>
                                    <SelectTrigger className="w-full bg-transparent border-none text-sm text-white font-bold px-0 h-auto gap-1 [&>span]:line-clamp-none focus:ring-0 shadow-none">
                                        <SelectValue placeholder="Adultos" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-brand-brown-dark text-white border-brand-brown-red z-[60] shadow-xl">
                                        <SelectItem value="1" className="focus:bg-brand-brown-red focus:text-white cursor-pointer py-2">1 Adulto</SelectItem>
                                        <SelectItem value="2" className="focus:bg-brand-brown-red focus:text-white cursor-pointer py-2">2 Adultos</SelectItem>
                                        <SelectItem value="3" className="focus:bg-brand-brown-red focus:text-white cursor-pointer py-2">3 Adultos</SelectItem>
                                        <SelectItem value="4" className="focus:bg-brand-brown-red focus:text-white cursor-pointer py-2">4 Adultos</SelectItem>
                                    </SelectContent>
                                </Select>
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
