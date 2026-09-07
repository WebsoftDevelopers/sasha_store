"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

const copy = {
  PENDING: {
    title: "Vendor Application Submitted",
    body: "Your store application has been successfully submitted. Our team will review your application within approximately 24 hours.",
    status: "Pending Review",
  },
  REJECTED: {
    title: "Application Rejected",
    body: "Review the administrator comments, update the missing information, and resubmit your application.",
    status: "Rejected",
  },
  SUSPENDED: {
    title: "Vendor Account Suspended",
    body: "Your store is temporarily suspended. Contact support or wait for an administrator update.",
    status: "Suspended",
  },
  DISABLED: {
    title: "Vendor Account Disabled",
    body: "Your store access is disabled. Contact support for next steps.",
    status: "Disabled",
  },
  NONE: {
    title: "No Vendor Application",
    body: "Start a vendor application to register your store.",
    status: "Not Started",
  },
  APPROVED: {
    title: "Vendor Approved",
    body: "Your store has been approved.",
    status: "Approved",
  },
} as const;

export default function VendorApplicationStatusPage() {
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
        if (!session?.access_token) throw new Error("Sign in to view vendor status");
        const mine = await shopsApi.mine(session.access_token).catch(() => null);
        if (cancelled) return;
        setShop(mine);
        if (mine?.vendorStatus === "APPROVED") router.replace("/vendor/dashboard");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load status");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const details = copy[shop?.vendorStatus ?? "NONE"];

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(760px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        {loading ? <p className="text-[var(--color-muted)]">Loading status...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {!loading && !error ? (
          <>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Status: {details.status}
            </p>
            <h1 className="m-0 mb-3 font-[var(--font-display)] text-[34px] font-normal">
              {details.title}
            </h1>
            <p className="m-0 mb-6 text-[15px] leading-7 text-[var(--color-muted)]">
              {details.body}
            </p>
            {shop ? (
              <div className="mb-6 grid gap-3 border border-[var(--color-border)] bg-[var(--color-cream)] p-4 text-[14px]">
                <p className="m-0"><strong>Store:</strong> {shop.name}</p>
                <p className="m-0"><strong>Slug:</strong> {shop.slug}</p>
                {shop.rejectionReason ? <p className="m-0"><strong>Reason:</strong> {shop.rejectionReason}</p> : null}
                {shop.adminComment ? <p className="m-0"><strong>Administrator comments:</strong> {shop.adminComment}</p> : null}
                {shop.missingDocuments?.length ? <p className="m-0"><strong>Missing documents:</strong> {shop.missingDocuments.join(", ")}</p> : null}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {shop?.vendorStatus === "REJECTED" || !shop ? (
                <Link href="/vendor/apply" className="auth-button max-w-[240px] text-center no-underline">
                  {shop ? "Edit application" : "Become a Vendor"}
                </Link>
              ) : null}
              <Link href="/account" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
                My Account
              </Link>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
