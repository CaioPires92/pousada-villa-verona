# Backup e recuperação do banco de produção

O banco Turso deve ser exportado para armazenamento persistente e privado. O disco de uma Function da Vercel é temporário e não é um destino de backup.

## Criar e validar um backup

Use um arquivo de ambiente protegido contendo `DATABASE_URL` e `DATABASE_AUTH_TOKEN`:

```bash
npm run db:backup:logical -- --env-file=.env.production --output=/destino-persistente/reservas-AAAA-MM-DD.sql
npm run db:backup:verify -- --input=/destino-persistente/reservas-AAAA-MM-DD.sql
```

O exportador abre uma transação somente de leitura, não sobrescreve arquivos e cria o dump com permissão `0600`. Depois da validação, envie-o para um armazenamento privado com retenção/versionamento (por exemplo, bucket S3/R2 ou artefato privado). Nunca faça commit do dump ou das credenciais.

## Restaurar com segurança

1. Crie um banco Turso novo e vazio; não restaure diretamente sobre produção.
2. Importe o SQL validado no banco novo.
3. Confira contagens de reservas, hóspedes, pagamentos e tentativas; teste uma consulta de disponibilidade.
4. Faça um deploy Preview apontando para o banco restaurado e execute os testes operacionais.
5. Somente depois altere as credenciais de produção. Mantenha o banco anterior disponível para rollback.

Uma execução realmente automática ainda exige escolher um destino persistente e fornecer credenciais restritas de escrita. Isso não deve ser improvisado no filesystem da Vercel.
