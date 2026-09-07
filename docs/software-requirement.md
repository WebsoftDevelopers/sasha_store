# Software Requirements

## Product Scope

Sasha Store is a fragrance marketplace with customer shopping flows, vendor/store onboarding, seller shop management, product catalog management, account security, media uploads, ratings, and orders.

## Core User Roles

- Guest users can browse products, view shops, register, sign in, reset passwords, and verify email.
- Customers can manage profiles, sessions, carts, orders, reviews, favorites, addresses, and vendor applications.
- Vendors are approved extensions of customer accounts; a vendor is the store owned by that user.
- Approved vendors can manage store information, products, documents, and seller orders without creating a second account.
- Admin users can review vendor applications and approve, reject, suspend, or disable stores.
- Service users can support privileged backend operations through secure service credentials.

## Functional Requirements

- The web app must provide storefront browsing, product detail pages, cart workflows, authentication screens, account pages, shop pages, and seller product management.
- The API must expose REST endpoints under `/api` and provide Swagger documentation at `/api/docs`.
- Authentication must use Supabase JWT validation, with API-side user mirroring through Prisma.
- Supabase is the source of truth for authentication and PostgreSQL application data.
- Cloudinary is the bucket/media provider for all images, videos, documents, and blobs.
- Uploaded media must be recorded in the centralized `media_assets` database table with owner, URL, Cloudinary public ID, media type, context, and optional entity reference.
- Product images, store logos, store banners, vendor documents, future videos, and blob-style uploads must use the centralized media asset architecture.
- Orders, ratings, shops, users, products, storage/media, and auth must be modeled as backend modules.
- Vendor/store status must use `NONE`, `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`, and `DISABLED`.
- Public product and shop browsing must expose approved vendor stores only.
- Product and seller-order management must require an approved vendor store.
- Upstash Redis is the external cache/queue Redis provider.
- Supabase database caching may be enabled where query-level caching is introduced.
- Namecheap SMTP is the email provider.
- BullMQ is the event and background-job queue layer.
- Database migrations must be managed through Prisma.
- Local development must run through Docker with one centralized env file.

## Non-Functional Requirements

- Configuration must stay centralized in `config`.
- Docker Compose and Dockerfiles must stay centralized in `config`.
- Ignore rules must be repository-wide through one `.gitignore` and one `.dockerignore`.
- Every service must receive runtime variables from `config/.env`.
- Docker startup must be available through a single script: `config/scripts/sasha.sh`.
- Local services must expose health checks where available.
- Secrets and local environment values must not be committed.

## Runtime Requirements

- Docker Desktop or Docker Engine with Docker Compose v2.
- Node.js 22 for local API, web, and mobile development outside Docker.
- npm 10 for Node package management.
- Python 3.12 for local agent development outside Docker.
- PostgreSQL 16 for app data when running through Docker.

## Local Service Ports

- Web: `3000`
- API: `8000`
- Mobile: `3001`
- Agent: `8001`
- PostgreSQL: `5432`
- Adminer: `8080`
- Mailpit UI: `8025`
- Mailpit SMTP: `1025`
- Redis: `6379`
