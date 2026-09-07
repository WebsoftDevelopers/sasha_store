"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { ordersApi, type DashboardResponse } from "@/lib/api/orders-api";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
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
        if (!session?.access_token) throw new Error("Sign in to open vendor dashboard");

        const mine = await shopsApi.mine(session.access_token).catch(() => null);
        if (!mine || mine.vendorStatus !== "APPROVED") {
          router.replace(mine ? "/vendor/application-status" : "/vendor/apply");
          return;
        }
        const data = await ordersApi.dashboard(session.access_token);
        if (!cancelled) {
          setShop(mine);
          setDashboard(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const stats = [
    ["Total Revenue", "₦0"],
    ["Total Orders", String(dashboard?.stats.sales ?? 0)],
    ["Pending Orders", "0"],
    ["Products", String(dashboard?.stats.products ?? 0)],
    ["Low Stock Products", "0"],
    ["Customers", "0"],
    ["Average Rating", "0.0"],
    ["New Reviews", "0"],
  ];

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(1180px,100%)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Vendor Dashboard
            </p>
            <h1 className="m-0 font-[var(--font-display)] text-[36px] font-normal">
              {shop?.name || "Vendor"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/products" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
              Back to Marketplace
            </Link>
            <Link href="/account" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
              My Account
            </Link>
          </div>
        </div>

        {loading ? <p className="text-[var(--color-muted)]">Loading dashboard...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {!loading && !error ? (
          <div className="grid gap-5">
            <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:grid-cols-1">
              {stats.map(([label, value]) => (
                <article key={label} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <p className="m-0 text-[12px] text-[var(--color-muted)]">{label}</p>
                  <strong className="mt-2 block text-[24px] font-semibold">{value}</strong>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-[280px_1fr] gap-5 lg:grid-cols-1">
              <nav className="grid gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] p-4" aria-label="Vendor navigation">
                {[
                  ["Overview", "/vendor/dashboard"],
                  ["Store Profile", "/vendor/store"],
                  ["Products", "/vendor/products"],
                  ["All Orders", "/account/orders"],
                  ["Product Reviews", "/account/orders"],
                  ["Business Documents", "/vendor/store"],
                ].map(([label, href]) => (
                  <Link key={label} href={href} className="border border-transparent px-3 py-2 text-[14px] no-underline hover:border-[var(--color-border)] hover:bg-[var(--color-cream)]">
                    {label}
                  </Link>
                ))}
              </nav>
              <section className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h2 className="m-0 mb-3 text-[18px]">Sales Overview</h2>
                <div className="grid h-52 place-items-center border border-dashed border-[var(--color-border)] bg-[var(--color-cream)] text-[14px] text-[var(--color-muted)]">
                  Sales charts will use live vendor order totals after payment reporting is added.
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
