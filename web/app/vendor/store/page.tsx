"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VendorApplicationForm } from "@/components/vendor/vendor-application-form";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

export default function VendorStorePage() {
  const router = useRouter();
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
        if (!session?.access_token) throw new Error("Sign in to manage your store");
        const mine = await shopsApi.mine(session.access_token).catch(() => null);
        if (!mine || mine.vendorStatus !== "APPROVED") {
          router.replace(mine ? "/vendor/application-status" : "/vendor/apply");
          return;
        }
        if (!cancelled) setShop(mine);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load store");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(980px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Store Management
            </p>
            <h1 className="m-0 font-[var(--font-display)] text-[32px] font-normal">
              Store Profile
            </h1>
          </div>
          <Link href="/vendor/dashboard" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
            Vendor Dashboard
          </Link>
        </div>
        {loading ? <p className="text-[var(--color-muted)]">Loading store...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {shop ? <VendorApplicationForm existing={shop} mode="store" onSaved={setShop} /> : null}
      </section>
    </main>
  );
}
