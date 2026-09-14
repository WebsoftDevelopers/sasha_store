-- Speed up common marketplace reads: product grids, shop pages, order history,
-- vendor admin queues, and product search.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "shops_vendor_status_updated_at_idx"
ON "shops"("vendor_status", "updated_at");

CREATE INDEX IF NOT EXISTS "products_shop_id_created_at_idx"
ON "products"("shop_id", "created_at");

CREATE INDEX IF NOT EXISTS "products_is_active_created_at_idx"
ON "products"("is_active", "created_at");

CREATE INDEX IF NOT EXISTS "products_is_active_category_created_at_idx"
ON "products"("is_active", "category", "created_at");

CREATE INDEX IF NOT EXISTS "products_is_active_price_idx"
ON "products"("is_active", "price");

CREATE INDEX IF NOT EXISTS "products_name_trgm_idx"
ON "products" USING gin ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "products_description_trgm_idx"
ON "products" USING gin ("description" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "ratings_product_id_created_at_idx"
ON "ratings"("product_id", "created_at");

CREATE INDEX IF NOT EXISTS "orders_buyer_id_created_at_idx"
ON "orders"("buyer_id", "created_at");

CREATE INDEX IF NOT EXISTS "orders_shop_id_created_at_idx"
ON "orders"("shop_id", "created_at");

CREATE INDEX IF NOT EXISTS "orders_shop_id_status_created_at_idx"
ON "orders"("shop_id", "status", "created_at");
