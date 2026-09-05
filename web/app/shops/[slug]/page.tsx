"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MarketingShell } from "@/components/site/marketing-shell";
import { shopsApi, type Shop } from "@/lib/api/shops-api";
import { useCart } from "@/lib/cart/cart-context";

export default function PublicShopPage() {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await shopsApi.bySlug(params.slug);
        if (!cancelled) setShop(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Shop not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (params.slug) void load();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  return (
    <MarketingShell>
      <section className="mx-auto w-[min(1100px,100%)] px-6 py-10">
        {loading ? <p className="text-[var(--color-muted)]">Loading shop...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {shop ? (
          <>
            <div className="border-b border-[var(--color-border)] pb-8">
              <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand)] uppercase">
                {shop.isVerified ? "Verified seller" : shop.verificationStatus.toLowerCase()}
              </p>
              <h1 className="mt-2 mb-3 font-[var(--font-display)] text-[44px] font-normal">
                {shop.name}
              </h1>
              <p className="m-0 max-w-[44rem] text-[15px] leading-7 text-[var(--color-muted)]">
                {shop.description || `${shop.city}, ${shop.state}`}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {(shop.products ?? []).map((product) => (
                <article key={product.id} className="product-card">
                  <Link href={`/products/${product.id}`} className="flex flex-1 flex-col text-inherit no-underline">
                    <div className="product-card__media">
                      {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="25vw" unoptimized={product.imageUrl.includes("placehold.co")} /> : null}
                    </div>
                    <div className="product-card__body">
                      <p className="m-0 text-[10px] uppercase text-[var(--color-muted)]">{product.category || "Product"}</p>
                      <h2 className="m-0 line-clamp-2 font-[var(--font-display)] text-[15px] font-normal">{product.name}</h2>
                      <p className="brand-text m-0 text-[13px] font-semibold">₦{Number(product.price).toLocaleString("en-NG")}</p>
                    </div>
                  </Link>
                  <div className="px-2.5 pb-2.5">
                    <button type="button" className="product-card__add" onClick={() => addItem({
                      productId: product.id,
                      name: product.name,
                      price: Number(product.price),
                      imageUrl: product.imageUrl,
                      shopId: shop.id,
                      shopName: shop.name,
                    })}>
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </MarketingShell>
  );
}
