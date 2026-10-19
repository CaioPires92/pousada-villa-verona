export const MERCADO_PAGO_SECURITY_SCRIPT_URL = 'https://www.mercadopago.com/v2/security.js';

const MAX_DEVICE_ID_LENGTH = 256;

export function normalizeMercadoPagoDeviceId(value: unknown) {
    const deviceId = typeof value === 'string' ? value.trim() : '';
    return deviceId ? deviceId.slice(0, MAX_DEVICE_ID_LENGTH) : undefined;
}

export function readMercadoPagoDeviceId() {
    if (typeof window === 'undefined') return undefined;
    return normalizeMercadoPagoDeviceId((window as typeof window & {
        MP_DEVICE_SESSION_ID?: unknown;
    }).MP_DEVICE_SESSION_ID);
}

export async function waitForMercadoPagoDeviceId(timeoutMs = 1_500, pollIntervalMs = 50) {
    const availableDeviceId = readMercadoPagoDeviceId();
    if (availableDeviceId) return availableDeviceId;

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, pollIntervalMs));
        const deviceId = readMercadoPagoDeviceId();
        if (deviceId) return deviceId;
    }

    return undefined;
}

export function buildMercadoPagoDeviceRequestOptions(deviceId: unknown) {
    const normalizedDeviceId = normalizeMercadoPagoDeviceId(deviceId);
    return normalizedDeviceId ? { meliSessionId: normalizedDeviceId } : {};
}

export function buildSafePaymentSecurityTelemetry(input: {
    deviceId: unknown;
    token: unknown;
    identification: unknown;
    paymentMethodId: unknown;
    paymentTypeId: unknown;
    installments: unknown;
}) {
    const deviceId = normalizeMercadoPagoDeviceId(input.deviceId);
    return {
        hasDeviceId: Boolean(deviceId),
        deviceIdLength: deviceId?.length || 0,
        hasCardToken: typeof input.token === 'string' && input.token.trim().length > 0,
        hasIdentification: Boolean(input.identification && typeof input.identification === 'object'),
        paymentMethodId: String(input.paymentMethodId || '').trim() || null,
        paymentTypeId: String(input.paymentTypeId || '').trim() || null,
        installments: Number.isInteger(Number(input.installments)) ? Number(input.installments) : null,
    };
}
