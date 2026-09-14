"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductUploadForm } from "@/components/products/product-upload-form";
import { createClient } from "@/lib/supabase/browser-client";
import { productsApi, type Product } from "@/lib/api/products-api";
import { shopsApi } from "@/lib/api/shops-api";

export default function VendorProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sign in to manage products");
      const shop = await shopsApi.mine(session.access_token).catch(() => null);
      if (!shop || shop.vendorStatus !== "APPROVED") {
        router.replace(shop ? "/vendor/application-status" : "/vendor/apply");
        return;
      }
      setProducts(await productsApi.mine(session.access_token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(980px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Vendor Products
            </p>
            <h1 className="m-0 font-[var(--font-display)] text-[32px] font-normal">
              Products
            </h1>
          </div>
          <Link href="/vendor/dashboard" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
            Vendor Dashboard
          </Link>
        </div>
        <ProductUploadForm onCreated={load} />
        <div className="mt-8">
          <h2 className="m-0 mb-4 text-[16px]">Your listings</h2>
          {loading ? <p className="text-[var(--color-muted)]">Loading...</p> : null}
          {error ? <p className="auth-error">{error}</p> : null}
          {!loading && products.length === 0 ? (
            <p className="border border-dashed border-[var(--color-border)] p-5 text-[14px] text-[var(--color-muted)]">
              No products yet.
            </p>
          ) : null}
          <ul className="m-0 grid list-none gap-3 p-0">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-3 border border-[var(--color-border)] p-3">
                <span className="relative h-16 w-16 shrink-0 bg-[var(--color-surface-elevated)]">
                  {product.imageUrl ? <Image src={product.imageUrl} alt="" fill className="object-cover" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{product.name}</span>
                  <span className="block text-[12px] text-[var(--color-muted)]">
                    {product.category || "Product"} · Stock {product.stock ?? 0} · ₦{Number(product.price).toLocaleString("en-NG")}
                  </span>
                </span>
                <span className="text-[11px] uppercase text-[var(--color-muted)]">
                  {product._count?.ratings ?? 0} reviews
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
