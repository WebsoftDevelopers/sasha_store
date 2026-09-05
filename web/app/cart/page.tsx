"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { MarketingShell } from "@/components/site/marketing-shell";
import { useAuth } from "@/lib/auth/auth-context";
import { useCart } from "@/lib/cart/cart-context";
import { createClient } from "@/lib/supabase/browser-client";
import { ordersApi } from "@/lib/api/orders-api";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clear, itemCount } =
    useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const signedIn = Boolean(user);
  const shopCount = useMemo(() => new Set(items.map((item) => item.shopId)).size, [items]);
  const canCheckout = signedIn && items.length > 0 && shopCount <= 1;

  const placeOrder = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (shopCount > 1) {
        throw new Error("Checkout one shop at a time because sellers manage their own delivery.");
      }
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sign in to checkout");
      await ordersApi.create(session.access_token, {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPhone,
        notes: notes.trim() || undefined,
      });
      clear();
      setMessage("Order placed. The seller can now manage it from their dashboard.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MarketingShell>
      <section className="mx-auto w-[min(900px,100%)] px-6 py-12">
        <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand)] uppercase">
          Your bag
        </p>
        <h1 className="mt-2 mb-2 font-[var(--font-display)] text-[40px] font-normal text-[var(--color-ink)]">
          Cart
        </h1>
        <span className="gold-rule mb-4" />
        <p className="m-0 mb-8 text-[14px] text-[var(--color-muted)]">
          {itemCount === 0
            ? "Your cart is empty."
            : `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart.`}
        </p>

        {items.length === 0 ? (
          <Link href="/products" className="auth-button inline-flex no-underline">
            Browse products
          </Link>
        ) : (
          <>
            <ul className="m-0 list-none space-y-4 p-0">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex flex-wrap gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 bg-[var(--color-cream)]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={item.imageUrl.includes("placehold.co")}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="m-0 font-[var(--font-display)] text-[20px] font-normal">
                      {item.name}
                    </h2>
                    <p className="m-0 mt-1 text-[13px] text-[var(--color-muted)]">
                      {item.shopName}
                    </p>
                    <p className="brand-text m-0 mt-2 text-[14px] font-semibold">
                      ₦{item.price.toLocaleString("en-NG")}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="text-[13px] text-[var(--color-muted)]">
                        Qty{" "}
                        <input
                          type="number"
                          min={1}
                          className="auth-input ml-1 inline-block w-20"
                          value={item.quantity}
                          onChange={(e) =>
                            setQuantity(
                              item.productId,
                              Number(e.target.value) || 1,
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="text-[13px] text-[var(--color-muted)] underline"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="m-0 text-[15px] font-semibold">
                    ₦{(item.price * item.quantity).toLocaleString("en-NG")}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--color-border)] pt-6">
              <button type="button" className="auth-button-secondary" onClick={clear}>
                Clear cart
              </button>
              <div className="ml-auto max-w-sm text-right">
                <p className="m-0 text-[14px] text-[var(--color-muted)]">Subtotal</p>
                <p className="brand-text m-0 text-[24px] font-semibold">
                  ₦{subtotal.toLocaleString("en-NG")}
                </p>
                <p className="mt-2 mb-4 text-[12px] leading-5 text-[var(--color-muted)]">
                  {signedIn
                    ? `Signed in as ${profile?.email || user?.email}. Keep shopping or proceed when checkout is ready.`
                    : "Cart is saved on this device. Sign in only when you're ready to place an order."}
                </p>
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href="/products"
                    className="auth-button m-0 inline-flex w-full max-w-[240px] no-underline"
                  >
                    {signedIn ? "Continue shopping" : "Browse products"}
                  </Link>
                  {!authLoading && !signedIn ? (
                    <Link
                      href="/auth/login?next=/cart"
                      className="auth-button-secondary m-0 inline-flex w-full max-w-[240px] no-underline"
                    >
                      Sign in to checkout
                    </Link>
                  ) : null}
                  {!authLoading && signedIn ? (
                    <a href="#checkout" className="auth-button-secondary m-0 inline-flex w-full max-w-[240px] justify-center no-underline">
                      Checkout
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
            <form id="checkout" onSubmit={placeOrder} className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h2 className="m-0 mb-2 font-[var(--font-display)] text-[24px] font-normal">
                Checkout
              </h2>
              <p className="m-0 text-[13px] leading-5 text-[var(--color-muted)]">
                Orders are sent to the seller. Checkout is limited to one shop at a time.
              </p>
              {shopCount > 1 ? (
                <p className="auth-error">
                  Your cart has products from multiple shops. Remove items until one shop remains.
                </p>
              ) : null}
              <label className="auth-label" htmlFor="shipping-address">Delivery address</label>
              <input id="shipping-address" className="auth-input" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} disabled={!canCheckout || busy} required />
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="auth-label" htmlFor="shipping-city">City</label>
                  <input id="shipping-city" className="auth-input" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} disabled={!canCheckout || busy} required />
                </div>
                <div>
                  <label className="auth-label" htmlFor="shipping-state">State</label>
                  <input id="shipping-state" className="auth-input" value={shippingState} onChange={(e) => setShippingState(e.target.value)} disabled={!canCheckout || busy} required />
                </div>
                <div>
                  <label className="auth-label" htmlFor="shipping-phone">Phone</label>
                  <input id="shipping-phone" className="auth-input" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} disabled={!canCheckout || busy} required />
                </div>
              </div>
              <label className="auth-label" htmlFor="shipping-notes">Notes</label>
              <textarea id="shipping-notes" className="auth-input min-h-[80px] py-2" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canCheckout || busy} />
              {error ? <p className="auth-error">{error}</p> : null}
              {message ? <p className="mt-3 text-[14px] text-[var(--color-success)]">{message}</p> : null}
              <button type="submit" className="auth-button max-w-[240px]" disabled={!canCheckout || busy}>
                {busy ? "Placing order..." : signedIn ? "Place order" : "Sign in first"}
              </button>
            </form>
          </>
        )}
      </section>
    </MarketingShell>
  );
}
