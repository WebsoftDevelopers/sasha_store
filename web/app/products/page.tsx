"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MarketingShell } from "@/components/site/marketing-shell";
import { CatalogFiltersSidebar } from "@/components/products/catalog-filters-sidebar";
import {
  productsApi,
  type Product,
  type ProductSort,
  type ProductsListResponse,
} from "@/lib/api/products-api";
import { useCart } from "@/lib/cart/cart-context";

function ProductsCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = (searchParams.get("sort") as ProductSort) || "newest";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const [result, setResult] = useState<ProductsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const setParams = useCallback(
    (patch: Record<string, string | null>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
      }
      if (resetPage) next.delete("page");
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    setParams({
      category: null,
      sort: null,
      minPrice: null,
      maxPrice: null,
    });
  }, [setParams]);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        q,
        category,
        sort,
        minPrice,
        maxPrice,
        page,
      }),
    [q, category, sort, minPrice, maxPrice, page],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await productsApi.list({
        q: q || undefined,
        category: category || undefined,
        sort,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        limit: 24,
      });
      setResult(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      setError(
        message === "Failed to fetch"
          ? "Cannot reach the API. Make sure the backend is running on http://localhost:8000."
          : message,
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [q, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    void load();
  }, [load, queryKey]);

  const products = result?.data ?? [];
  const meta = result?.meta;
  const isSearch = Boolean(q.trim());

  const onAdd = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      shopId: product.shop?.id || "",
      shopName: product.shop?.name || "Shop",
    });
    setAddedId(product.id);
    window.setTimeout(() => setAddedId((id) => (id === product.id ? null : id)), 1200);
  };

  const productGrid = (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.045,
          },
        },
      }}
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 ${
        isSearch ? "lg:grid-cols-3" : "lg:grid-cols-4 xl:grid-cols-4"
      }`}
    >
      {products.map((product) => (
        <motion.article
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="product-card"
        >
          <Link
            href={`/products/${product.id}`}
            className="flex min-h-0 flex-1 flex-col text-inherit no-underline"
          >
            <div className="product-card__media">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={
                    product.imageUrl.includes("picsum.photos") ||
                    product.imageUrl.includes("placehold.co")
                  }
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[12px] text-[var(--color-muted)]">
                  No image
                </div>
              )}
            </div>
            <div className="product-card__body">
              <p className="m-0 text-[10px] tracking-wide text-[var(--color-muted)] uppercase">
                {product.category || "Product"}
                {product.shop?.isVerified ? " · Verified" : ""}
              </p>
              <h2 className="m-0 line-clamp-2 font-[var(--font-display)] text-[15px] leading-snug font-normal">
                {product.name}
              </h2>
              {product.shop?.name ? (
                <p className="m-0 line-clamp-1 text-[11px] text-[var(--color-muted)]">
                  {product.shop.name}
                </p>
              ) : null}
              <p className="brand-text m-0 text-[13px] font-semibold">
                ₦{Number(product.price).toLocaleString("en-NG")}
              </p>
            </div>
          </Link>
          <div className="px-2.5 pb-2.5">
            <button
              type="button"
              className={`product-card__add${addedId === product.id ? " is-added" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAdd(product);
              }}
            >
              {addedId === product.id ? "Added" : "Add to cart"}
            </button>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );

  return (
    <section className="mx-auto w-[min(1200px,100%)] px-6 pt-6 pb-12 md:pt-5">
      {loading || pending ? (
        <p className="mb-5 text-[13px] text-[var(--color-muted)]">Loading...</p>
      ) : null}

      {error ? (
        <div className="mb-6">
          <p className="auth-error">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 border border-[var(--color-border)] px-3 py-1.5 text-[13px]"
          >
            Retry
          </button>
        </div>
      ) : null}

      {isSearch ? (
        <div className="grid items-start gap-6 lg:grid-cols-[240px_1fr]">
          <CatalogFiltersSidebar
            category={category}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={setParams}
            onReset={resetFilters}
          />

          <div className="min-w-0">
            {!loading && !pending && meta ? (
              <p className="mb-5 text-[14px] text-[var(--color-muted)]">
                Found {meta.total.toLocaleString()} product
                {meta.total === 1 ? "" : "s"} for &ldquo;
                <span className="text-[var(--color-ink)]">{q}</span>&rdquo;
              </p>
            ) : null}

            {!loading && !error && products.length === 0 ? (
              <div className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
                <h2 className="m-0 mb-3 font-[var(--font-display)] text-[26px] font-normal">
                  No products match
                </h2>
                <p className="mx-auto mb-0 max-w-[30rem] text-[15px] text-[var(--color-muted)]">
                  Try another search or adjust filters.
                </p>
              </div>
            ) : null}

            {productGrid}

            {meta && meta.totalPages > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="auth-button-secondary"
                  disabled={page <= 1}
                  onClick={() => setParams({ page: String(page - 1) }, false)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="auth-button-secondary"
                  disabled={page >= meta.totalPages}
                  onClick={() => setParams({ page: String(page + 1) }, false)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {!loading && !error && products.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
              <h2 className="m-0 mb-3 font-[var(--font-display)] text-[26px] font-normal">
                No products match
              </h2>
              <p className="mx-auto mb-0 max-w-[30rem] text-[15px] text-[var(--color-muted)]">
                Try searching from the header.
              </p>
            </div>
          ) : null}

          {productGrid}

          {meta && meta.totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                className="auth-button-secondary"
                disabled={page <= 1}
                onClick={() => setParams({ page: String(page - 1) }, false)}
              >
                Previous
              </button>
              <button
                type="button"
                className="auth-button-secondary"
                disabled={page >= meta.totalPages}
                onClick={() => setParams({ page: String(page + 1) }, false)}
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default function ProductsPage() {
  return (
    <MarketingShell>
      <Suspense
        fallback={
          <p className="px-6 py-12 text-[var(--color-muted)]">Loading catalog...</p>
        }
      >
        <ProductsCatalog />
      </Suspense>
    </MarketingShell>
  );
}
