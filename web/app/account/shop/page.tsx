"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShopForm } from "@/components/account/shop-form";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

export default function ShopPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Sign in to manage a shop");
        const mine = await shopsApi.mine(session.access_token);
        if (!cancelled) setShop(mine);
      } catch (err) {
        if (!cancelled && err instanceof Error && !err.message.includes("404")) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px] font-normal">
            {shop ? "Manage Shop" : "Create Shop"}
          </h2>
          <p className="m-0 text-[14px] leading-6 text-[var(--color-muted)]">
            One user can run one shop for now. Your shop can sell fragrance,
            cosmetics, perfume, body care, or another category later.
          </p>
        </div>
        {shop ? (
          <Link href={`/shops/${shop.slug}`} className="auth-button-secondary inline-flex px-4 py-2 text-[13px] no-underline">
            View public shop
          </Link>
        ) : null}
      </div>
      {loading ? <p className="text-[var(--color-muted)]">Loading shop...</p> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {!loading ? <ShopForm existing={shop} onSaved={setShop} /> : null}
    </>
  );
}
