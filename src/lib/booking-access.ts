import { jwtVerify, SignJWT } from 'jose';
import { readAdminSessionTokenFromCookies, verifyAdminJwt } from '@/lib/admin-jwt';

const BOOKING_ACCESS_TTL_SECONDS = 7 * 24 * 60 * 60;

function getSecret() {
    return String(process.env.BOOKING_ACCESS_SECRET || process.env.ADMIN_JWT_SECRET || '').trim();
}

function getKey(secret: string) {
    return new TextEncoder().encode(secret);
}

function getCookieValue(request: Request, name: string) {
    const cookies = String(request.headers.get('cookie') || '').split(';');
    for (const cookie of cookies) {
        const separator = cookie.indexOf('=');
        if (separator < 0) continue;
        if (cookie.slice(0, separator).trim() !== name) continue;
        return decodeURIComponent(cookie.slice(separator + 1).trim());
    }
    return undefined;
}

export function getBookingAccessCookieName(bookingId: string) {
    return `booking_access_${bookingId}`;
}

export function getBookingAccessCookieOptions(bookingId: string) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: `/api/bookings/${bookingId}`,
        maxAge: BOOKING_ACCESS_TTL_SECONDS,
    };
}

export async function signBookingAccessToken(bookingId: string) {
    const secret = getSecret();
    if (!secret) return null;

    const now = Math.floor(Date.now() / 1000);
    return new SignJWT({ role: 'booking' })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setSubject(bookingId)
        .setIssuedAt(now)
        .setExpirationTime(now + BOOKING_ACCESS_TTL_SECONDS)
        .sign(getKey(secret));
}

async function verifyBookingAccessToken(token: string, bookingId: string) {
    const secret = getSecret();
    if (!secret) return false;

    try {
        const { payload } = await jwtVerify(token, getKey(secret), { algorithms: ['HS256'] });
        return payload.role === 'booking' && payload.sub === bookingId;
    } catch {
        return false;
    }
}

export async function authorizeBookingRequest(request: Request, bookingId: string) {
    const headerToken = String(request.headers.get('x-booking-access-token') || '').trim();
    const cookieToken = getCookieValue(request, getBookingAccessCookieName(bookingId));
    const bookingToken = headerToken || cookieToken;
    if (bookingToken && await verifyBookingAccessToken(bookingToken, bookingId)) {
        return { authorized: true, token: bookingToken };
    }

    const secret = String(process.env.ADMIN_JWT_SECRET || '').trim();
    if (!secret) return { authorized: false, token: null };

    const cookieReader = {
        get(name: string) {
            const value = getCookieValue(request, name);
            return value ? { value } : undefined;
        },
    };
    const adminToken = readAdminSessionTokenFromCookies(cookieReader, process.env.NODE_ENV);
    const admin = adminToken ? await verifyAdminJwt(adminToken, secret) : null;
    return { authorized: Boolean(admin), token: null };
}
