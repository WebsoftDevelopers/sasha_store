CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'BLOB');

CREATE TABLE "media_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "owner_id" UUID NOT NULL,
  "asset_type" "MediaAssetType" NOT NULL,
  "context" TEXT,
  "entity_type" TEXT,
  "entity_id" UUID,
  "url" TEXT NOT NULL,
  "secure_url" TEXT,
  "public_id" TEXT NOT NULL,
  "resource_type" TEXT NOT NULL,
  "format" TEXT,
  "mime_type" TEXT,
  "bytes" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "duration" DECIMAL(10, 3),
  "provider" TEXT NOT NULL DEFAULT 'cloudinary',
  "folder" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "media_assets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "media_assets_public_id_key" ON "media_assets"("public_id");
CREATE INDEX "media_assets_owner_id_idx" ON "media_assets"("owner_id");
CREATE INDEX "media_assets_asset_type_idx" ON "media_assets"("asset_type");
CREATE INDEX "media_assets_context_idx" ON "media_assets"("context");
CREATE INDEX "media_assets_entity_type_entity_id_idx" ON "media_assets"("entity_type", "entity_id");
