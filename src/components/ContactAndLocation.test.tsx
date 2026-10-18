import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ContactAndLocation from './ContactAndLocation';

describe('ContactAndLocation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envia os dados preenchidos para a rota de contato', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactAndLocation />);

    fireEvent.change(screen.getByPlaceholderText('Ex: João Silva'), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByPlaceholderText('joao@email.com'), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('(00) 00000-0000'), { target: { value: '(19) 99999-9999' } });
    fireEvent.change(screen.getByPlaceholderText('Como podemos ajudar?'), { target: { value: 'Gostaria de informações.' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '(19) 99999-9999',
          message: 'Gostaria de informações.',
          website: '',
          subject: 'Contato',
        }),
      });
      expect(screen.getByRole('status')).toHaveTextContent('Mensagem enviada com sucesso!');
    });
  });

  it('mostra uma mensagem quando o envio falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    render(<ContactAndLocation />);

    fireEvent.change(screen.getByPlaceholderText('Ex: João Silva'), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByPlaceholderText('joao@email.com'), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('(00) 00000-0000'), { target: { value: '(19) 99999-9999' } });
    fireEvent.change(screen.getByPlaceholderText('Como podemos ajudar?'), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível enviar. Tente novamente.');
  });
});
