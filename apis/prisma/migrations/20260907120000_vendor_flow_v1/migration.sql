CREATE TYPE "VendorStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DISABLED');

ALTER TABLE "shops"
  ADD COLUMN "banner_url" TEXT,
  ADD COLUMN "category" TEXT,
  ADD COLUMN "owner_first_name" TEXT,
  ADD COLUMN "owner_last_name" TEXT,
  ADD COLUMN "owner_email" TEXT,
  ADD COLUMN "owner_phone" TEXT,
  ADD COLUMN "alternative_phone" TEXT,
  ADD COLUMN "identification_type" TEXT,
  ADD COLUMN "identification_number" TEXT,
  ADD COLUMN "registered_business_name" TEXT,
  ADD COLUMN "business_registration_type" TEXT,
  ADD COLUMN "registration_date" DATE,
  ADD COLUMN "country" TEXT DEFAULT 'Nigeria',
  ADD COLUMN "lga" TEXT,
  ADD COLUMN "street_address" TEXT,
  ADD COLUMN "postal_code" TEXT,
  ADD COLUMN "latitude" DECIMAL(10, 7),
  ADD COLUMN "longitude" DECIMAL(10, 7),
  ADD COLUMN "business_phone" TEXT,
  ADD COLUMN "business_email" TEXT,
  ADD COLUMN "website" TEXT,
  ADD COLUMN "social_links" JSONB,
  ADD COLUMN "business_registration_document_url" TEXT,
  ADD COLUMN "tax_certificate_url" TEXT,
  ADD COLUMN "additional_document_urls" JSONB,
  ADD COLUMN "vendor_status" "VendorStatus" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "admin_comment" TEXT,
  ADD COLUMN "rejection_reason" TEXT,
  ADD COLUMN "missing_documents" JSONB,
  ADD COLUMN "reviewed_at" TIMESTAMP(3),
  ADD COLUMN "reviewed_by_id" UUID;

UPDATE "shops"
SET
  "vendor_status" = CASE "verification_status"::text
    WHEN 'PENDING' THEN 'PENDING'::"VendorStatus"
    WHEN 'VERIFIED' THEN 'APPROVED'::"VendorStatus"
    WHEN 'REJECTED' THEN 'REJECTED'::"VendorStatus"
    ELSE 'NONE'::"VendorStatus"
  END,
  "admin_comment" = "verification_note",
  "reviewed_at" = "verified_at",
  "owner_email" = "email",
  "owner_phone" = "phone",
  "business_email" = "email",
  "business_phone" = "phone",
  "registered_business_name" = "legal_name",
  "street_address" = "business_address";

DROP INDEX IF EXISTS "shops_verification_status_idx";
CREATE INDEX "shops_vendor_status_idx" ON "shops"("vendor_status");

ALTER TABLE "shops"
  DROP COLUMN "verification_status",
  DROP COLUMN "verification_note",
  DROP COLUMN "verified_at";

DROP TYPE "VerificationStatus";
