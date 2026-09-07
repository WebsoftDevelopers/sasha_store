"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SashaLogo } from "@/components/brand/sasha-logo";
import { createClient } from "@/lib/supabase/browser-client";
import { shopsApi, type VendorStatus } from "@/lib/api/shops-api";

const groups = [
  {
    title: "Shopping",
    items: [
      { href: "/account/orders", label: "Orders" },
      { href: "/account/favorites", label: "Favorites" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/account", label: "My Account" },
      { href: "/account/addresses", label: "Addresses" },
      { href: "/account/notifications", label: "Notifications" },
      { href: "/account/security", label: "Security" },
    ],
  },
];

function vendorLink(status: VendorStatus | null) {
  if (status === "APPROVED") {
    return { href: "/vendor/dashboard", label: "Vendor Dashboard" };
  }
  if (status && status !== "NONE") {
    return { href: "/vendor/application-status", label: "Vendor Application" };
  }
  return { href: "/vendor/apply", label: "Become a Vendor" };
}

export function AccountSidebar() {
  const [status, setStatus] = useState<VendorStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const shop = await shopsApi.mine(session.access_token).catch(() => null);
      if (!cancelled) setStatus(shop?.vendorStatus ?? null);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selling = vendorLink(status);

  return (
    <aside className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <SashaLogo size={36} wordmarkClassName="brand-text text-[18px]" />
      <p className="mt-4 mb-5 text-[13px] leading-5 text-[var(--color-muted)]">
        Manage shopping, account settings, and vendor access.
      </p>
      <nav className="grid gap-5" aria-label="Account navigation">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="m-0 mb-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--color-muted)] uppercase">
              {group.title}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block border border-transparent px-3 py-2.5 text-[14px] text-[var(--color-ink)] no-underline transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-cream)] hover:text-[var(--color-brand)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="m-0 mb-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--color-muted)] uppercase">
            Selling
          </p>
          <Link
            href={selling.href}
            className="block border border-transparent px-3 py-2.5 text-[14px] text-[var(--color-ink)] no-underline transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-cream)] hover:text-[var(--color-brand)]"
          >
            {selling.label}
          </Link>
        </div>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="w-full border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-left text-[14px] text-[var(--color-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            Logout
          </button>
        </form>
      </nav>
    </aside>
  );
}
