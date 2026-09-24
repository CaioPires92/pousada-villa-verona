'use client';

import type { ReactNode } from 'react';
import { CalendarDays, Users } from 'lucide-react';

type AvailabilityBarProps = {
    checkIn: string;
    checkOut: string;
    adults: number;
    childrenCount: number;
    alterControl: ReactNode;
    children?: ReactNode;
};

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' });

function parseYmd(value: string) {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function capitalize(value: string) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMonthShort(date: Date) {
    return capitalize(monthFormatter.format(date).replace('.', ''));
}

function formatCompactDateRange(checkIn: string, checkOut: string) {
    const from = parseYmd(checkIn);
    const to = parseYmd(checkOut);
    if (!from || !to) return `${checkIn} - ${checkOut}`;

    const fromDay = String(from.getUTCDate()).padStart(2, '0');
    const toDay = String(to.getUTCDate()).padStart(2, '0');
    const fromMonth = formatMonthShort(from);
    const toMonth = formatMonthShort(to);

    if (fromMonth === toMonth) return `${fromDay}-${toDay} ${fromMonth}`;
    return `${fromDay} ${fromMonth} - ${toDay} ${toMonth}`;
}

export default function AvailabilityBar({
    checkIn,
    checkOut,
    adults,
    childrenCount,
    alterControl,
    children,
}: AvailabilityBarProps) {
    const adultsLabel = `${adults} adulto${adults === 1 ? '' : 's'}`;
    const childrenLabel = `${childrenCount} criança${childrenCount === 1 ? '' : 's'}`;
    const formattedDates = formatCompactDateRange(checkIn, checkOut);

    return (
        <div className="mb-6 border border-brand-brown-dark/10 bg-[color:var(--brand-white)] px-5 py-4 shadow-sm rounded-xl">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    <div className="inline-flex items-center gap-2 border border-border/40 bg-card px-2.5 py-1.5 text-sm font-medium text-foreground">
                        <CalendarDays className="h-4 w-4 text-brand-brown-dark" />
                        <span>{formattedDates}</span>
                    </div>
                    <div className="hidden h-4 w-px bg-border sm:block" />
                    <div className="inline-flex items-center gap-2 border border-border/40 bg-card px-2.5 py-1.5 text-sm font-medium text-foreground">
                        <Users className="h-4 w-4 text-brand-brown-dark" />
                        <span>{`${adultsLabel} · ${childrenLabel}`}</span>
                    </div>
                </div>
                <div className="shrink-0">{alterControl}</div>
            </div>
                <div className="hidden lg:block w-px h-8 bg-border/50 mx-4"></div>
                {children}
            </div>
        </div>
    );
}
