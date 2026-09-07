"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { authApi } from "@/lib/api/auth-api";
import { shopsApi, type Shop, type VendorStatus } from "@/lib/api/shops-api";

const statuses: (VendorStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
  "DISABLED",
  "NONE",
];

export default function AdminVendorsPage() {
  const [status, setStatus] = useState<VendorStatus | "ALL">("PENDING");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Admin sign in required");
        const me = await authApi.me(session.access_token);
        if (me.role !== "ADMIN") throw new Error("Admin only");
        const data = await shopsApi.adminList(
          session.access_token,
          status === "ALL" ? undefined : status,
        );
        if (!cancelled) setShops(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load vendors");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(1100px,100%)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Admin
            </p>
            <h1 className="m-0 font-[var(--font-display)] text-[36px] font-normal">
              Vendor Applications
            </h1>
          </div>
          <Link href="/account" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
            My Account
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              className={`border px-3 py-2 text-[12px] ${status === item ? "brand-fill" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? <p className="text-[var(--color-muted)]">Loading vendors...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {!loading && !error && shops.length === 0 ? (
          <p className="border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[14px] text-[var(--color-muted)]">
            No vendor applications found.
          </p>
        ) : null}
        <ul className="m-0 grid list-none gap-3 p-0">
          {shops.map((shop) => (
            <li key={shop.id} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-[11px] tracking-[0.12em] text-[var(--color-brand)] uppercase">
                    {shop.vendorStatus}
                  </p>
                  <h2 className="m-0 mt-1 text-[18px]">{shop.name}</h2>
                  <p className="m-0 mt-1 text-[13px] text-[var(--color-muted)]">
                    {shop.owner?.email || shop.email} · {shop.city}, {shop.state}
                  </p>
                </div>
                <Link href={`/admin/vendors/${shop.id}`} className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
                  Review
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
