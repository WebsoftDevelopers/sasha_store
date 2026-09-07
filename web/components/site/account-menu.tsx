"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HiOutlineUserCircle, HiChevronDown } from "react-icons/hi2";
import { useAuth } from "@/lib/auth/auth-context";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type VendorStatus } from "@/lib/api/shops-api";

function vendorMenuItem(status: VendorStatus | null) {
  if (status === "APPROVED") {
    return { href: "/vendor/dashboard", label: "Vendor Dashboard" };
  }
  if (status && status !== "NONE") {
    return { href: "/vendor/application-status", label: "Vendor Application" };
  }
  return { href: "/vendor/apply", label: "Become a Vendor" };
}

export function AccountMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<VendorStatus | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!user) {
        setVendorStatus(null);
        return;
      }
      async function loadVendorStatus() {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const shop = await shopsApi.mine(session.access_token).catch(() => null);
        if (!cancelled) setVendorStatus(shop?.vendorStatus ?? null);
      }
      void loadVendorStatus();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [user]);

  if (loading) {
    return (
      <div
        className="h-11 w-11 shrink-0 border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
        aria-hidden
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        aria-label="Sign in"
        className="inline-flex h-11 items-center justify-center border border-[var(--color-border)] px-3 text-[12px] font-semibold tracking-[0.08em] text-[var(--color-brand-light)] uppercase no-underline transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
      >
        Sign in
      </Link>
    );
  }

  const displayName =
    profile?.fullName?.trim() ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Account";
  const email = profile?.email || user.email || "";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");
  const vendorItem = vendorMenuItem(vendorStatus);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-11 items-center gap-2 border px-2.5 text-[var(--color-brand-light)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] ${
          open
            ? "border-[var(--color-brand)] text-[var(--color-brand)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <span className="brand-fill relative flex h-7 w-7 items-center justify-center overflow-hidden text-[11px] font-semibold">
          {profile?.avatarUrl ? (
            // Avatar URLs may be remote; keep lightweight in the header.
            <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials || <HiOutlineUserCircle className="text-[16px]" aria-hidden />
          )}
        </span>
        <span className="hidden max-w-[100px] truncate text-[12px] font-medium text-[var(--color-brand-light)] sm:inline">
          {displayName}
        </span>
        <span
          className="hidden h-1.5 w-1.5 rounded-full bg-[var(--color-success)] sm:inline-block"
          title="Signed in"
          aria-label="Signed in"
        />
        <HiChevronDown
          className={`text-[14px] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+6px)] right-0 z-[130] w-[260px] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 shadow-[var(--glow-gold)]"
        >
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="m-0 truncate text-[13px] font-semibold text-[var(--color-ink)]">
              {displayName}
            </p>
            <p className="m-0 mt-0.5 truncate text-[12px] text-[var(--color-muted)]">
              {email}
            </p>
            <p className="m-0 mt-2 text-[10px] font-semibold tracking-[0.12em] text-[var(--color-brand)] uppercase">
              Signed in
              {profile?.role ? ` · ${profile.role.toLowerCase()}` : ""}
            </p>
          </div>

          <Link
            href="/products"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Continue shopping
          </Link>
          <Link
            href="/cart"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Cart
          </Link>
          <Link
            href="/account"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Account overview
          </Link>
          <Link
            href={vendorItem.href}
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            {vendorItem.label}
          </Link>
          <Link
            href="/account/orders"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <Link
            href="/account/profile"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/account/security"
            role="menuitem"
            className="block px-4 py-2.5 text-[13px] text-[var(--color-ink)] no-underline hover:bg-[var(--color-surface-elevated)]"
            onClick={() => setOpen(false)}
          >
            Security
          </Link>
          <button
            type="button"
            role="menuitem"
            className="mt-1 w-full border-t border-[var(--color-border)] px-4 py-2.5 text-left text-[13px] text-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-brand-deep)]"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
