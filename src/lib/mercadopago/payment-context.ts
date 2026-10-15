type PaymentContextInput = {
    bookingId: string;
    roomTypeId: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    amount: number;
    guestName: string;
    guestPhone?: string | null;
    ipAddress?: string | null;
};

function splitGuestName(rawName: string) {
    const parts = String(rawName || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
    return {
        firstName: parts[0] || undefined,
        lastName: parts.length > 1 ? parts.slice(1).join(' ') : undefined,
    };
}

export function normalizeBrazilianPhone(rawPhone?: string | null) {
    let digits = String(rawPhone || '').replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length >= 12) digits = digits.slice(2);
    if (digits.length < 10 || digits.length > 11) return undefined;

    return {
        area_code: digits.slice(0, 2),
        number: digits.slice(2),
    };
}

export function buildMercadoPagoPaymentContext(input: PaymentContextInput) {
    const { firstName, lastName } = splitGuestName(input.guestName);
    const phone = normalizeBrazilianPhone(input.guestPhone);
    const nights = Math.max(1, Math.round((input.checkOut.getTime() - input.checkIn.getTime()) / 86_400_000));
    const description = `${input.checkIn.toISOString().slice(0, 10)} a ${input.checkOut.toISOString().slice(0, 10)}; ${input.adults} adulto(s), ${input.children} criança(s)`;

    return {
        payerPhone: phone,
        additionalInfo: {
            ...(input.ipAddress ? { ip_address: input.ipAddress } : {}),
            payer: {
                ...(firstName ? { first_name: firstName } : {}),
                ...(lastName ? { last_name: lastName } : {}),
                ...(phone ? { phone } : {}),
            },
            items: [{
                id: input.roomTypeId || input.bookingId,
                title: `Hospedagem - ${input.roomName}`.slice(0, 120),
                description: `${nights} diária(s); ${description}`.slice(0, 256),
                category_id: 'travel',
                quantity: 1,
                currency_id: 'BRL',
                unit_price: input.amount,
                event_date: input.checkIn.toISOString(),
            }],
        },
    };
}

export function getPaymentRejectionMessage(statusDetail: unknown) {
    const detail = String(statusDetail || '').trim().toLowerCase();
    if (detail === 'cc_rejected_high_risk' || detail === 'cc_rejected_blacklist') {
        return 'O pagamento não passou pela análise de segurança. Evite repetir imediatamente com o mesmo cartão; tente Pix ou outro cartão.';
    }
    if (detail === 'cc_rejected_insufficient_amount') {
        return 'O cartão não possui limite disponível para esta compra. Tente outro cartão, menos parcelas ou Pix.';
    }
    if (detail === 'cc_rejected_call_for_authorize') {
        return 'O banco pediu autorização para a compra. Entre em contato com o emissor do cartão e tente novamente depois.';
    }
    if (detail === 'cc_rejected_invalid_installments') {
        return 'O banco não aceitou a quantidade de parcelas escolhida. Tente menos parcelas ou outro meio de pagamento.';
    }
    if (detail === 'cc_rejected_card_disabled') {
        return 'O cartão está bloqueado para esta compra. Confirme a liberação com o banco ou escolha outro meio de pagamento.';
    }
    if (detail === 'cc_rejected_max_attempts') {
        return 'O limite de tentativas foi atingido. Aguarde antes de tentar novamente ou escolha Pix/outro cartão.';
    }
    if (detail === 'cc_rejected_3ds_challenge') {
        return 'A autenticação do banco não foi concluída. Tente novamente e confirme a compra no aplicativo do banco.';
    }
    return 'Pagamento não aprovado. Revise os dados ou tente Pix/outro cartão.';
}

export function isRetryablePaymentRejection(status: unknown) {
    return String(status || '').trim().toUpperCase() === 'REJECTED';
}
