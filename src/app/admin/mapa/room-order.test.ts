import { describe, expect, it } from 'vitest';
import { getRoomSortPriority, normalizeRoomName } from './room-order';

describe('room order', () => {
    it('orders the Villa Verona rooms as requested', () => {
        const rooms = [
            'Quarto Quíntuplo',
            'Quarto Quádruplo Comfort',
            'Quarto Triplo',
            'Quarto Quádruplo',
        ];

        const ordered = rooms.sort((a, b) => {
            const priority = getRoomSortPriority(a) - getRoomSortPriority(b);
            return priority || normalizeRoomName(a).localeCompare(normalizeRoomName(b), 'pt-BR');
        });

        expect(ordered).toEqual([
            'Quarto Triplo',
            'Quarto Quádruplo',
            'Quarto Quádruplo Comfort',
            'Quarto Quíntuplo',
        ]);
    });

    it('places unknown room names after the configured rooms', () => {
        expect(getRoomSortPriority('Suíte futura')).toBe(4);
    });
});
