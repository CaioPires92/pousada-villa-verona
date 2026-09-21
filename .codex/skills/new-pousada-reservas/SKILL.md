---
name: new-pousada-reservas
description: Configure a new pousada from this reservation-engine template, including independent credentials, database and brand assets. Use when starting or adapting a new property project from this template.
---

# Nova pousada com motor de reservas

Prepare a new property without carrying operational data, credentials or identity from another pousada.

## Inicialização obrigatória

1. Create a new `.env` from `.env.example` and generate new secrets and credentials for this property. Never copy the source property's database, Mercado Pago token, SMTP password, admin secrets or guest records.
2. Install only the dependencies declared in the lockfile:

   ```bash
   npm ci
   ```

3. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Create the first migration for this property's empty database:

   ```bash
   npx prisma migrate dev --name initial-reservation-schema
   ```

The template intentionally has no inherited Prisma migrations. Do not point a new project at an existing Delplata database.

## Antes de publicar

- Replace the logo, all gallery photos, property name, address, contact channels, SEO metadata, e-mail copy and domain.
- Configure a Mercado Pago account and webhook secret owned by the new property.
- Set new room types, pricing and inventory in the new database.
- Verify with `npm run typecheck`, `npm run test` and `npm run build`.

The public images and text are only a functional visual reference. Keep their file paths until replacement assets and references are ready, then remove the old assets in the same change.
