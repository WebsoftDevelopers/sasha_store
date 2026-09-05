"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProductUploadForm } from "@/components/products/product-upload-form";
import { createClient } from "@/lib/supabase/browser-client";
import { productsApi, type Product } from "@/lib/api/products-api";

export default function AccountProductsPage() {
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
      setProducts(await productsApi.mine(session.access_token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px] font-normal">
        Seller Products
      </h2>
      <p className="m-0 mb-6 text-[14px] leading-6 text-[var(--color-muted)]">
        Add products to your shop and keep stock visible for buyers.
      </p>
      <ProductUploadForm onCreated={load} />
      <div className="mt-8">
        <h3 className="m-0 mb-4 text-[16px]">Your listings</h3>
        {loading ? <p className="text-[var(--color-muted)]">Loading...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {!loading && products.length === 0 ? (
          <p className="border border-dashed border-[var(--color-border)] p-5 text-[14px] text-[var(--color-muted)]">
            No products yet. Create your shop first, then add your first listing.
          </p>
        ) : null}
        <ul className="m-0 grid list-none gap-3 p-0">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-3 border border-[var(--color-border)] p-3">
              <span className="relative h-16 w-16 shrink-0 bg-[var(--color-surface-elevated)]">
                {product.imageUrl ? <Image src={product.imageUrl} alt="" fill className="object-cover" unoptimized={product.imageUrl.includes("placehold.co")} /> : null}
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
    </>
  );
}
