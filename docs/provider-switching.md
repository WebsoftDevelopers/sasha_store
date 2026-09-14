# Provider Switching

The app is configured around provider contracts, not one fixed vendor.

## Auth Providers

The web app expects a Supabase-compatible auth client today. That means these work without code changes:

- Hosted Supabase Auth
- Self-hosted GoTrue
- Any auth service that exposes the same Supabase Auth API

Hosted Supabase Auth is the active production default. The production Docker
stack sends the web and API containers to `API_SUPABASE_URL`, and the local GoTrue
container only starts when the `selfhost-auth` profile is explicitly enabled.

Set these values in your private VPS `.env`:

```env
API_AUTH_PROVIDER=supabase
API_AUTH_URL=https://<supabase-project-ref>.supabase.co
API_AUTH_PUBLIC_KEY=<supabase-publishable-or-anon-key>
API_AUTH_SERVICE_KEY=<supabase-service-role-or-secret-key>
API_AUTH_JWT_SECRET=<supabase-jwt-secret>
# Prefer JWKS when your Supabase project uses asymmetric JWT signing:
API_AUTH_JWKS_URL=https://<supabase-project-ref>.supabase.co/auth/v1/.well-known/jwks.json
API_AUTH_JWT_AUDIENCE=authenticated
API_AUTH_REQUIRED_ROLE=authenticated
API_AUTH_ROLE_CLAIM=role

NEXT_PUBLIC_AUTH_PROVIDER=supabase
NEXT_PUBLIC_AUTH_URL=https://<supabase-project-ref>.supabase.co
NEXT_PUBLIC_AUTH_PUBLIC_KEY=<supabase-publishable-or-anon-key>

API_SUPABASE_URL=https://<supabase-project-ref>.supabase.co
API_SUPABASE_PUBLISHABLE_KEY=<supabase-publishable-key>
API_SUPABASE_ANON_KEY=<supabase-anon-key-if-used>
API_SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
API_SUPABASE_JWT_SECRET=<supabase-jwt-secret>
API_SUPABASE_JWKS_URL=https://<supabase-project-ref>.supabase.co/auth/v1/.well-known/jwks.json
```

The API verifies JWTs generically. To use another JWT provider, set:

```env
API_AUTH_PROVIDER=custom
API_AUTH_URL=https://auth.example.com
API_AUTH_PUBLIC_KEY=...
API_AUTH_SERVICE_KEY=...
API_AUTH_JWT_SECRET=...
# or:
API_AUTH_JWKS_URL=https://auth.example.com/.well-known/jwks.json
API_AUTH_JWT_ISSUER=https://auth.example.com/
API_AUTH_JWT_AUDIENCE=authenticated
API_AUTH_REQUIRED_ROLE=authenticated
API_AUTH_ROLE_CLAIM=role
```

For the web client, set:

```env
NEXT_PUBLIC_AUTH_PROVIDER=supabase
NEXT_PUBLIC_AUTH_URL=https://example.com
NEXT_PUBLIC_AUTH_PUBLIC_KEY=...
```

Legacy unprefixed API auth variables still work as compatibility aliases, but
new `.env` entries must use `API_` or `NEXT_` prefixes.

Run the normal production stack:

```bash
docker compose -f config/docker-compose.prod.yml up -d --build
```

To test the optional self-hosted auth profile later:

```bash
docker compose -f config/docker-compose.prod.yml --profile selfhost-auth up -d auth
```

That profile is not part of the default hosted Supabase rollout.

## Supabase Auth Dashboard

Configure the hosted Supabase project:

- Enable email/password auth.
- Enable email confirmation.
- Set the site URL to `https://<domain>`.
- Set password recovery redirect to `https://<domain>/auth/reset-password`.
- Add redirect URLs:
  - `https://<domain>/auth/callback`
  - `https://<domain>/auth/reset-password`
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/reset-password`

The app keeps Supabase as the identity source and stores application user
details in the local PostgreSQL database. Protected API calls sync users through
`users.ensureFromJwt()` on `/api/auth/me`, `/api/users/me`, products, vendors,
orders, ratings, shops, and storage flows. Synced fields are:

- `id`
- `email`
- `fullName`
- `avatarUrl`
- `authProvider`

## Sasha Fragrance Auth Email

Configure Supabase Auth SMTP in the Supabase Dashboard. Do not commit the email
password to the repository.

```text
Sender email: support@sashafragrance.com
From name: Sasha Fragrance
SMTP host: mail.privateemail.com
SMTP port: 587
Security: STARTTLS
SMTP user: support@sashafragrance.com
SMTP password: use the mailbox password as a Supabase secret
```

Use the same mailbox only in private secret stores if you also want database
backup emails from the VPS:

```env
API_NAMECHEAP_SMTP_HOST=mail.privateemail.com
API_NAMECHEAP_SMTP_PORT=587
API_NAMECHEAP_SMTP_USER=support@sashafragrance.com
API_NAMECHEAP_SMTP_PASSWORD=<private-mailbox-password>
API_EMAIL_FROM=support@sashafragrance.com

API_BACKUP_EMAIL_ENABLED=true
API_BACKUP_EMAIL_TO=support@sashafragrance.com
```

Because the mailbox password was shared in chat, rotate it after setup if this
is a real production mailbox.

## Google OAuth

Enable Google in Supabase Auth providers:

- Create a Google OAuth client in Google Cloud Console.
- Add this authorized redirect URI in Google:
  `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
- Store the Google client ID and secret in Supabase Dashboard.
- Keep the app redirect URL in Supabase as `https://<domain>/auth/callback`.

Successful Google login lands on `/auth/callback`, creates or updates the local
app user through `/api/auth/me`, then sends the user to `/account`.

## Email Deliverability

After SMTP is configured:

- Send a Supabase test email.
- Register a new test user and confirm the branded email arrives.
- Check spam and promotions folders.
- Confirm `sashafragrance.com` has SPF, DKIM, and DMARC records matching the
  mailbox provider.

## Storage Providers

Uploads use the S3-compatible storage contract. These work by changing env only:

- MinIO
- AWS S3
- Cloudflare R2
- Backblaze B2 S3 API
- DigitalOcean Spaces
- Any S3-compatible object store

Set:

```env
API_STORAGE_PROVIDER=s3
API_S3_ENDPOINT=https://s3-compatible-endpoint.example.com
API_S3_PUBLIC_URL=https://cdn-or-public-url.example.com
API_S3_BUCKET=sasha-store
API_S3_REGION=us-east-1
API_S3_ACCESS_KEY=...
API_S3_SECRET_KEY=...
API_S3_FORCE_PATH_STYLE=true
```

For AWS S3 virtual-hosted style, use `API_S3_FORCE_PATH_STYLE=false`.

Self-hosted MinIO runs by default in the production stack. To use external
S3/R2/B2/Spaces, set the `API_S3_*` env vars to that provider.

```bash
docker compose -f config/docker-compose.prod.yml up -d --build
```

## Database

The app uses Prisma with PostgreSQL today. You can switch between local Docker
Postgres, managed Postgres, Supabase Postgres, Neon, Railway, Render, or any
PostgreSQL-compatible provider by changing `API_DATABASE_URL` and
`API_DIRECT_URL`.

Changing to a non-Postgres database needs a Prisma schema migration and application testing.

## Daily Database Backups

The production Docker stack includes a `postgres-backup` service. It runs
`pg_dump` once per day, stores compressed custom-format dumps in the
`postgres_backups` Docker volume, deletes backups older than the retention
window, and emails success/failure notifications.

Set:

```env
API_BACKUP_TIME=02:00
API_BACKUP_RETENTION_DAYS=14
API_BACKUP_EMAIL_ENABLED=true
API_BACKUP_EMAIL_TO=owner@example.com
API_BACKUP_RUN_ON_START=false
API_NAMECHEAP_SMTP_HOST=smtp.example.com
API_NAMECHEAP_SMTP_PORT=587
API_NAMECHEAP_SMTP_USER=smtp-user
API_NAMECHEAP_SMTP_PASSWORD=smtp-password
API_EMAIL_FROM=backups@example.com
```

Use `API_NAMECHEAP_SMTP_PORT=465` only if the provider requires SSL.

To run an immediate backup once the stack is up:

```bash
docker compose -f config/docker-compose.prod.yml run --rm -e BACKUP_RUN_ONCE=true postgres-backup
```

To restore a backup:

```bash
docker compose -f config/docker-compose.prod.yml exec postgres sh -c 'pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" /backups/latest.dump'
```

For serious production, copy the `postgres_backups` volume off the VPS too:
daily local backups protect you from database mistakes, but off-server backups
protect you from VPS loss.

## Private Docker Networking

Production services talk over Docker networks:

- `public_edge`: only Caddy joins this network and publishes `80` / `443`.
- `app_private`: web, API, agent-ai, Postgres, Redis, MinIO, and backups use this private Docker network.

The API talks to agent-ai with:

```env
AGENT_API_BASE_URL=http://agent-ai:8001
```

The database, Redis, MinIO, API, web, and agent-ai do not publish host ports in
production. Public traffic enters through Caddy, which proxies `/api/*`,
`/storage/*`, and the web app. Hosted Supabase Auth stays outside the VPS and is
reached directly through `API_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`.
