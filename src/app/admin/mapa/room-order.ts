const ROOM_ORDER = [
    'quarto triplo',
    'quarto quadruplo',
    'quarto quadruplo comfort',
    'quarto quintuplo',
];

export function normalizeRoomName(name: string) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function getRoomSortPriority(name: string) {
    const index = ROOM_ORDER.indexOf(normalizeRoomName(name));
    return index >= 0 ? index : ROOM_ORDER.length;
}
