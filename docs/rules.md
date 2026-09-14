# Project Rules

## Folder Structure

- Do not create new root folders or new root files unless the user explicitly asks.
- Keep platform and deployment configuration inside `config`.
- Keep project documentation inside `docs`.
- Keep API code inside `apis`, web code inside `web`, mobile code inside `mobile`, and agent code inside `agent`.

## Environment Variable Naming Rules

- Every environment variable in `config/.env` and `config/.env.example` must be owned by a service prefix.
- API-owned variables must start with `API_`.
- Web-owned variables must start with `NEXT_`. Public browser variables keep the normal Next.js `NEXT_PUBLIC_` prefix.
- Mobile-owned variables must start with `EXPO_`. Public mobile variables should use `EXPO_PUBLIC_`.
- Agent-owned variables must start with `AGENT_`.
- Provider variables must be namespaced under the service that uses them. Use `API_SUPABASE_URL`, not `SUPABASE_URL`; use `NEXT_PUBLIC_SUPABASE_URL`, not a shared web auth key; use `API_NAMECHEAP_SMTP_HOST`, not `SMTP_HOST`.
- Docker Compose may translate service-prefixed variables into internal container variables required by images, such as `POSTGRES_USER`, `MINIO_ROOT_USER`, `PORT`, `DATABASE_URL`, or `SMTP_HOST`. Those translated names should stay inside Compose or container runtime config, not become the public `.env` naming pattern.
- When adding a new service variable, add it to `config/.env.example` using the correct prefix and update Compose/application config to read that prefixed name first.

## Vendor And Store Rules

- Every person signs up as a customer first.
- A vendor is not a second user account; vendor access is an extension of the existing user account.
- `Vendor = Store` in the domain model.
- Each user can own only one store in V1.
- Vendor status must drive UI and API access: `NONE`, `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`, `DISABLED`.
- Customers with pending applications cannot submit duplicate applications.
- Rejected applications can be edited and resubmitted.
- Seller product and seller order tools require `APPROVED` vendor status.
- Public storefronts and public product lists must only expose approved vendor stores.

## Media Rules

- Do not store image, video, document, or blob file bytes in PostgreSQL.
- All uploaded media files must be stored through the configured S3-compatible storage provider.
- Every upload used by the app should be recorded in the centralized `media_assets` table.
- Product images, shop logos, shop banners, vendor documents, future videos, and miscellaneous blobs must all use the media asset registry.
- Database records may keep direct URL fields for fast reads and compatibility, but storage provider IDs and metadata belong in `media_assets`.

## Provider Rules

- Supabase is used for authentication.
- PostgreSQL is used for application data.
- S3-compatible object storage is used for media.
- Redis is used for caching and BullMQ queue backing.
- Supabase database caching may be used for database-query caching when implemented.
- Namecheap SMTP is used for transactional email.
- BullMQ is used for background jobs and domain events.
