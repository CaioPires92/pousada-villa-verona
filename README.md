# Motor de Reservas — Base

Base independente para criar um novo site de pousada com motor de reservas. Ela inclui o fluxo público de reservas, painel administrativo, disponibilidade, preços, cupons, pagamentos por Mercado Pago, e-mails, banco Prisma/SQLite, testes e scripts de deploy.

Esta pasta não contém `node_modules`, `.next`, arquivos `.env`, bancos locais, backups, CRM, Evolution API, n8n, histórico Git nem credenciais da Delplata.

## Começar um novo projeto

1. Renomeie esta pasta para o nome da nova pousada.
2. Crie um repositório Git novo, se desejar versioná-la: `git init -b main`.
3. Copie `.env.example` para `.env` e preencha todas as credenciais da nova pousada.
4. Rode `npm ci` para instalar dependências exatamente conforme `package-lock.json`.
5. Rode `npm run prisma:generate`, depois `npx prisma migrate dev --name initial-reservation-schema` para criar um banco e o primeiro migration desta nova pousada. Não copie nenhum banco da Delplata.
6. Troque logo, fotos, textos, domínio, e-mails de operação e configurações de pagamento antes do deploy.
7. Rode `npm run typecheck`, `npm run test` e `npm run build` antes de publicar.

## O que deve ser personalizado

| Área | Onde revisar |
| --- | --- |
| Marca, textos e navegação | `src/app`, `src/components`, `src/lib/seo.ts` |
| Logo e galerias | `public/fotos`, `public/banners`, `src/lib/room-photos.ts` |
| Tipos de acomodação, preços e estoque | banco novo, `prisma/schema.prisma`, scripts de seed |
| Mercado Pago | variáveis `.env` e telas/rotas em `src/app/api/mercadopago` |
| E-mails | `.env` e `src/lib/email.ts` |
| Domínio, Vercel e segurança | `.env`, `next.config.ts`, `vercel.json` |

## Itens mantidos de propósito

As imagens e textos públicos ainda são os da Delplata para que a interface permaneça funcional como referência visual. Troque-os antes de publicar uma nova pousada. Não reutilize credenciais, banco ou dados de hóspedes da Delplata.

O diretório `prisma/migrations` começa vazio de propósito. A base usa o schema atual de reservas, mas não leva o histórico de migrations da Delplata, que continha fases já removidas do CRM. Gere o primeiro migration próprio no passo 5.

## Rotina local

```bash
npm ci
npm run dev:web
```

O servidor local abre na porta `3001`.

Para uma orientação assistida, use a skill local [`new-pousada-reservas`](.codex/skills/new-pousada-reservas/SKILL.md).
