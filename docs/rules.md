# Project Rules

## Folder Structure

- Do not create new root folders or new root files unless the user explicitly asks.
- Keep platform and deployment configuration inside `config`.
- Keep project documentation inside `docs`.
- Keep API code inside `apis`, web code inside `web`, mobile code inside `mobile`, and agent code inside `agent`.

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
- All uploaded media files must be stored in Cloudinary.
- Every Cloudinary upload used by the app should be recorded in the centralized `media_assets` table.
- Product images, shop logos, shop banners, vendor documents, future videos, and miscellaneous blobs must all use the media asset registry.
- Database records may keep direct URL fields for fast reads and compatibility, but Cloudinary `public_id` and metadata belong in `media_assets`.

## Provider Rules

- Supabase is used for authentication.
- Supabase PostgreSQL is used for hosted application data.
- Cloudinary is used as the media bucket.
- Upstash Redis is used for hosted caching and BullMQ queue backing.
- Supabase database caching may be used for database-query caching when implemented.
- Namecheap SMTP is used for transactional email.
- BullMQ is used for background jobs and domain events.
