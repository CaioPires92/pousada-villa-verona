import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MobileBookingBar from './MobileBookingBar';

const mocks = vi.hoisted(() => ({
    pathname: '/',
    push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    usePathname: () => mocks.pathname,
    useRouter: () => ({ push: mocks.push }),
}));

describe('MobileBookingBar', () => {
    beforeEach(() => {
        mocks.pathname = '/acomodacoes';
        mocks.push.mockClear();
    });

    it('abre a busca com datas e ocupação selecionadas', async () => {
        render(<MobileBookingBar />);

        const link = await screen.findByRole('link', { name: /simular reserva/i });
        expect(link).toHaveAttribute('href', '/reservar');

        fireEvent.click(link);
        expect(mocks.push).toHaveBeenCalledWith(
            expect.stringMatching(/^\/reservar\?checkIn=\d{4}-\d{2}-\d{2}&checkOut=\d{4}-\d{2}-\d{2}&adults=2&children=0$/),
        );
    });

    it.each(['/reservar', '/reservar/confirmacao', '/admin', '/admin/reservas'])(
        'does not render on %s',
        (pathname) => {
            mocks.pathname = pathname;
            const { container } = render(<MobileBookingBar />);
            expect(container).toBeEmptyDOMElement();
        },
    );
});
