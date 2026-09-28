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

O servidor local abre na porta `3005`.

## Trabalhar em outro computador

### Primeira vez: clonar o projeto

```bash
git clone https://github.com/CaioPires92/pousada-villa-verona.git
cd pousada-villa-verona
npm run setup:local
npm run dev:web
```

O comando `npm run setup:local` funciona em Linux, macOS e Windows. Ele instala as dependências, solicita o login da Vercel, vincula o projeto, baixa as variáveis de desenvolvimento, cria segredos locais e prepara um banco SQLite local. As credenciais de produção permanecem protegidas na Vercel e não são copiadas para o computador.

O arquivo gerado é `.env.local`. Ele é ignorado pelo Git e não deve ser enviado manualmente para outro computador.

### Projeto já clonado: receber atualizações

Antes de atualizar, confirme se existem alterações locais:

```bash
git status
git pull origin main
npm ci
npm run dev:web
```

Use `npm ci` depois do `git pull` quando `package.json` ou `package-lock.json` tiver mudado. Caso contrário, normalmente basta executar `npm run dev:web`.

### Quando usar `npm i`

Use `npm i` ou `npm install` somente quando precisar adicionar ou atualizar uma biblioteca:

```bash
npm i nome-da-biblioteca
```

Esse comando pode alterar `package.json` e `package-lock.json`. Para apenas reproduzir o projeto em outro computador, prefira `npm ci`.

### Enviar suas alterações

```bash
git status
git add arquivos-alterados
git commit -m "descrição da alteração"
git push origin main
```

O push para a branch `main` inicia o deploy da Vercel usando as variáveis de produção cadastradas no projeto.

Para uma orientação assistida, use a skill local [`new-pousada-reservas`](.codex/skills/new-pousada-reservas/SKILL.md).
