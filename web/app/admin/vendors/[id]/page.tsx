"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { authApi } from "@/lib/api/auth-api";
import { shopsApi, type Shop } from "@/lib/api/shops-api";

export default function AdminVendorDetailPage() {
  const params = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [token, setToken] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [missingDocuments, setMissingDocuments] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
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
      setToken(session.access_token);
      setShop(await shopsApi.adminDetail(session.access_token, params.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load vendor");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const run = async (action: "approve" | "reject" | "suspend" | "disable") => {
    if (!token || !shop) return;
    setBusy(true);
    setError(null);
    try {
      if (action === "approve") {
        await shopsApi.approve(token, shop.id, note || "Approved");
      }
      if (action === "reject") {
        await shopsApi.reject(token, shop.id, {
          reason: reason || "Application rejected",
          comment: note || "Please review and resubmit.",
          missingDocuments: missingDocuments
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean),
        });
      }
      if (action === "suspend") {
        await shopsApi.suspend(token, shop.id, note || "Suspended by admin");
      }
      if (action === "disable") {
        await shopsApi.disable(token, shop.id, note || "Disabled by admin");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <section className="mx-auto w-[min(980px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
        <Link href="/admin/vendors" className="auth-link text-[13px]">
          Back to applications
        </Link>
        {loading ? <p className="text-[var(--color-muted)]">Loading vendor...</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}
        {shop ? (
          <div className="mt-5 grid gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="m-0 mb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
                  {shop.vendorStatus}
                </p>
                <h1 className="m-0 font-[var(--font-display)] text-[34px] font-normal">
                  {shop.name}
                </h1>
                <p className="m-0 mt-2 text-[14px] text-[var(--color-muted)]">
                  {shop.slug} · {shop.city}, {shop.state}
                </p>
              </div>
              <Link href={`/shops/${shop.slug}`} className="auth-button-secondary px-4 py-2 text-[13px] no-underline">
                Public shop
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Owner", `${shop.ownerFirstName || ""} ${shop.ownerLastName || ""}`.trim() || shop.owner?.fullName || "Not provided"],
                ["Owner email", shop.ownerEmail || shop.owner?.email || "Not provided"],
                ["Owner phone", shop.ownerPhone || "Not provided"],
                ["Identification", `${shop.identificationType || ""} ${shop.identificationNumber || ""}`.trim() || "Not provided"],
                ["Legal name", shop.legalName],
                ["CAC number", shop.cacNumber],
                ["TIN", shop.tin || "Not provided"],
                ["Business address", shop.businessAddress],
                ["Documents", [shop.cacDocumentUrl, shop.idDocumentUrl, shop.proofOfAddressUrl].filter(Boolean).length ? "Uploaded" : "Missing"],
                ["Products", String(shop._count?.products ?? 0)],
              ].map(([label, value]) => (
                <div key={label} className="border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
                  <p className="m-0 text-[12px] text-[var(--color-muted)]">{label}</p>
                  <p className="m-0 mt-1 text-[14px]">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              <label className="grid gap-1" htmlFor="admin-note">
                <span className="auth-label">Administrator comments</span>
                <textarea id="admin-note" className="auth-input min-h-[86px] py-2" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              <label className="grid gap-1" htmlFor="reject-reason">
                <span className="auth-label">Rejection reason</span>
                <input id="reject-reason" className="auth-input" value={reason} onChange={(event) => setReason(event.target.value)} />
              </label>
              <label className="grid gap-1" htmlFor="missing-documents">
                <span className="auth-label">Missing documents</span>
                <textarea id="missing-documents" className="auth-input min-h-[70px] py-2" value={missingDocuments} onChange={(event) => setMissingDocuments(event.target.value)} placeholder="One per line" />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="auth-button max-w-[160px]" disabled={busy} onClick={() => void run("approve")}>
                Approve
              </button>
              <button type="button" className="auth-button-secondary px-4 py-2 text-[13px]" disabled={busy} onClick={() => void run("reject")}>
                Reject
              </button>
              <button type="button" className="auth-button-secondary px-4 py-2 text-[13px]" disabled={busy} onClick={() => void run("suspend")}>
                Suspend
              </button>
              <button type="button" className="auth-button-secondary px-4 py-2 text-[13px]" disabled={busy} onClick={() => void run("disable")}>
                Disable
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
