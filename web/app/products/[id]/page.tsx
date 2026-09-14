"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { MarketingShell } from "@/components/site/marketing-shell";
import { productsApi, type Product } from "@/lib/api/products-api";
import { ratingsApi } from "@/lib/api/ratings-api";
import { useCart } from "@/lib/cart/cart-context";
import { useAuth } from "@/lib/auth/auth-context";
import { createClient } from "@/lib/supabase/browser-client";

type ProductDetail = Product & {
  averageRating?: number | null;
  ratings?: {
    id: string;
    score: number;
    comment: string | null;
    user?: { id: string; fullName: string | null };
  }[];
  description?: string | null;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const loadProduct = async (id: string) => {
    const data = await productsApi.get(id);
    setProduct(data as ProductDetail);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.get(params.id);
        if (!cancelled) setProduct(data as ProductDetail);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Product not found");
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (params.id) void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const onAdd = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      shopId: product.shop?.id || "",
      shopName: product.shop?.name || "Shop",
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!product) return;
    setReviewBusy(true);
    setReviewError(null);
    setReviewMessage(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sign in to review products");
      await ratingsApi.upsert(session.access_token, {
        productId: product.id,
        score,
        comment: comment.trim() || undefined,
      });
      setComment("");
      setReviewMessage("Review saved.");
      await loadProduct(product.id);
    } catch (err) {
      setReviewError(
        err instanceof Error
          ? err.message
          : "Could not save review",
      );
    } finally {
      setReviewBusy(false);
    }
  };

  return (
    <MarketingShell>
      <section className="mx-auto w-[min(1100px,100%)] px-6 py-10">
        <Link
          href="/products"
          className="nav-link mb-6 inline-block text-[13px]"
        >
          ← Back to shop
        </Link>

        {loading ? (
          <p className="text-[var(--color-muted)]">Loading product...</p>
        ) : null}
        {error ? <p className="auth-error">{error}</p> : null}

        {product ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 md:grid-cols-2"
          >
            <div className="relative aspect-square overflow-hidden border border-[var(--color-border)] bg-[var(--color-cream)]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
                  No image
                </div>
              )}
            </div>

            <div>
              <p className="m-0 text-[12px] tracking-wide text-[var(--color-muted)] uppercase">
                {product.category || "Product"}
                {product.shop?.isVerified ? " · Verified shop" : ""}
              </p>
              <h1 className="mt-2 mb-3 font-[var(--font-display)] text-[36px] font-normal text-[var(--color-ink)] md:text-[32px]">
                {product.name}
              </h1>
              {product.shop?.name ? (
                <p className="m-0 mb-4 text-[14px] text-[var(--color-muted)]">
                  Sold by {product.shop.name}
                  {product.shop.city ? ` · ${product.shop.city}` : ""}
                </p>
              ) : null}
              <p className="brand-text m-0 mb-4 text-[24px] font-semibold">
                ₦{Number(product.price).toLocaleString("en-NG")}
              </p>
              {product.averageRating != null ? (
                <p className="m-0 mb-4 text-[13px] text-[var(--color-muted)]">
                  ★ {product.averageRating.toFixed(1)} ·{" "}
                  {product.ratings?.length ?? 0} ratings
                </p>
              ) : null}
              <p className="m-0 mb-6 text-[15px] leading-7 text-[var(--color-muted)]">
                {product.description || "No description yet."}
              </p>
              <div className="mb-6 grid grid-cols-3 gap-2 border-y border-[var(--color-border)] py-4 text-[12px] text-[var(--color-muted)]">
                <span>Stock: {product.stock ?? 0}</span>
                <span>Seller managed delivery</span>
                <span>Buyer reviews only</span>
              </div>
              <button
                type="button"
                className={`auth-button max-w-[240px] transition-transform duration-150 active:scale-[0.97]${added ? " !bg-[var(--color-success)] !border-[var(--color-success)]" : ""}`}
                onClick={onAdd}
              >
                {added ? "Added to cart" : "Add to cart"}
              </button>
            </div>
          </motion.div>
        ) : null}
        {product ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 border-t border-[var(--color-border)] pt-8"
          >
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <form onSubmit={submitReview} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h2 className="m-0 mb-2 font-[var(--font-display)] text-[24px] font-normal">
                  Rate this product
                </h2>
                <p className="m-0 text-[13px] leading-5 text-[var(--color-muted)]">
                  Reviews are accepted after a confirmed, shipped, or delivered purchase.
                </p>
                <label className="auth-label" htmlFor="review-score">Rating</label>
                <select id="review-score" className="auth-input" value={score} onChange={(e) => setScore(Number(e.target.value))} disabled={reviewBusy || !user}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} star{value === 1 ? "" : "s"}</option>
                  ))}
                </select>
                <label className="auth-label" htmlFor="review-comment">Comment</label>
                <textarea id="review-comment" className="auth-input min-h-[96px] py-2" value={comment} onChange={(e) => setComment(e.target.value)} disabled={reviewBusy || !user} />
                {reviewError ? <p className="auth-error">{reviewError}</p> : null}
                {reviewMessage ? <p className="mt-3 text-[14px] text-[var(--color-success)]">{reviewMessage}</p> : null}
                {user ? (
                  <button type="submit" className="auth-button max-w-[220px]" disabled={reviewBusy}>
                    {reviewBusy ? "Saving..." : "Save review"}
                  </button>
                ) : (
                  <Link href={`/auth/login?next=/products/${product.id}`} className="auth-button max-w-[220px] no-underline">
                    Sign in to review
                  </Link>
                )}
              </form>
              <div>
                <h2 className="m-0 mb-4 font-[var(--font-display)] text-[24px] font-normal">
                  Customer reviews
                </h2>
                {product.ratings?.length ? (
                  <ul className="m-0 grid list-none gap-3 p-0">
                    {product.ratings.map((rating) => (
                      <li key={rating.id} className="border border-[var(--color-border)] p-4">
                        <p className="m-0 text-[13px] text-[var(--color-brand-deep)]">
                          {"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)}
                        </p>
                        <p className="m-0 mt-2 text-[14px] leading-6 text-[var(--color-muted)]">
                          {rating.comment || "No comment."}
                        </p>
                        <p className="m-0 mt-3 text-[12px] text-[var(--color-muted)]">
                          {rating.user?.fullName || "Verified buyer"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="border border-dashed border-[var(--color-border)] p-5 text-[14px] text-[var(--color-muted)]">
                    No reviews yet.
                  </p>
                )}
              </div>
            </div>
          </motion.section>
        ) : null}
      </section>
    </MarketingShell>
  );
}
