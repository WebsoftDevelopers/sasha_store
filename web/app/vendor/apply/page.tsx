"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VendorApplicationForm } from "@/components/vendor/vendor-application-form";
import { createClient } from "@/lib/supabase/browser-client";
import { authApi } from "@/lib/api/auth-api";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

export default function VendorApplyPage() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [defaults, setDefaults] = useState({
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    email: "",
    businessEmail: "",
  });
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
        if (!session?.access_token) throw new Error("Sign in to apply");

        const [profile, mine] = await Promise.all([
          authApi.me(session.access_token),
          shopsApi.mine(session.access_token).catch(() => null),
        ]);
        if (cancelled) return;
        const parts = (profile.fullName || "").trim().split(/\s+/);
        setDefaults({
          ownerFirstName: parts[0] || "",
          ownerLastName: parts.slice(1).join(" "),
          ownerEmail: profile.email,
          ownerPhone: "",
          email: profile.email,
          businessEmail: profile.email,
        });
        setShop(mine);
        if (mine?.vendorStatus === "APPROVED") {
          router.replace("/vendor/dashboard");
        } else if (mine && !["REJECTED", "NONE"].includes(mine.vendorStatus)) {
          router.replace("/vendor/application-status");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load vendor application");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) return <main className="min-h-screen p-8">Loading...</main>;

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-cream)] p-8">
        <p className="auth-error">{error}</p>
        <Link href="/auth/login" className="auth-link">Sign in</Link>
      </main>
    );
  }

  if (shop?.vendorStatus === "APPROVED" || (shop && !["REJECTED", "NONE"].includes(shop.vendorStatus))) {
    return <main className="min-h-screen p-8">Redirecting...</main>;
  }

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(980px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
              Vendor Application
            </p>
            <h1 className="m-0 font-[var(--font-display)] text-[32px] font-normal">
              Register Your Store
            </h1>
          </div>
          <Link href="/account" className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
            My Account
          </Link>
        </div>
        {shop?.vendorStatus === "REJECTED" ? (
          <div className="mb-6 border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
            <h2 className="m-0 mb-2 text-[18px]">Application Rejected</h2>
            <p className="m-0 text-[14px] text-[var(--color-muted)]">
              {shop.rejectionReason || shop.adminComment || "Review the notes and resubmit your application."}
            </p>
          </div>
        ) : null}
        <VendorApplicationForm
          key={shop?.id ?? "new"}
          existing={shop}
          defaults={defaults}
          onSaved={() => {
            router.push("/vendor/application-status");
          }}
        />
      </section>
    </main>
  );
}
