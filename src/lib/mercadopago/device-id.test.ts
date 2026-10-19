import { afterEach, describe, expect, it } from 'vitest';

import {
    buildMercadoPagoDeviceRequestOptions,
    buildSafePaymentSecurityTelemetry,
    normalizeMercadoPagoDeviceId,
    readMercadoPagoDeviceId,
} from './device-id';

describe('Mercado Pago Device ID', () => {
    afterEach(() => {
        delete (window as typeof window & { MP_DEVICE_SESSION_ID?: unknown }).MP_DEVICE_SESSION_ID;
    });

    it('reads and normalizes the browser Device ID', () => {
        (window as typeof window & { MP_DEVICE_SESSION_ID?: unknown }).MP_DEVICE_SESSION_ID = '  device-session-123  ';

        expect(readMercadoPagoDeviceId()).toBe('device-session-123');
        expect(normalizeMercadoPagoDeviceId('   ')).toBeUndefined();
    });

    it('forwards only a non-empty Device ID to the SDK', () => {
        expect(buildMercadoPagoDeviceRequestOptions(' device-session-123 ')).toEqual({
            meliSessionId: 'device-session-123',
        });
        expect(buildMercadoPagoDeviceRequestOptions(undefined)).toEqual({});
    });

    it('reports only safe presence metadata', () => {
        const telemetry = buildSafePaymentSecurityTelemetry({
            deviceId: 'secret-device-id',
            token: 'secret-card-token',
            identification: { type: 'CPF', number: '12345678909' },
            paymentMethodId: 'master',
            paymentTypeId: 'credit_card',
            installments: 3,
        });

        expect(telemetry).toEqual({
            hasDeviceId: true,
            deviceIdLength: 16,
            hasCardToken: true,
            hasIdentification: true,
            paymentMethodId: 'master',
            paymentTypeId: 'credit_card',
            installments: 3,
        });
        expect(JSON.stringify(telemetry)).not.toContain('secret');
        expect(JSON.stringify(telemetry)).not.toContain('12345678909');
    });
});
