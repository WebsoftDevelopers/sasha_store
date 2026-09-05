"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { authApi, type AppUser } from "@/lib/api/auth-api";

export default function AccountPage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError("Not signed in");
          return;
        }
        const me = await authApi.me(session.access_token);
        if (!cancelled) setUser(me);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load account");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-[var(--color-muted)]">Loading account...</p>;
  }

  if (error) {
    return (
      <>
        <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">Account</h2>
        <p className="auth-error">{error}</p>
        <p className="text-[13px] text-[var(--color-muted)]">
          If the Nest API is not running or Supabase env is missing, start the backend and check `.env`.
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">
        Account Overview
      </h2>
      <p className="m-0 mb-6 text-[14px] text-[var(--color-muted)]">
        Signed in as <strong>{user?.email}</strong>
        {user?.fullName ? ` (${user.fullName})` : ""}. Provider:{" "}
        {user?.authProvider}.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
        {[
          {
            title: "Create or manage shop",
            href: "/account/shop",
            body: "Set up one shop page, business details, and public seller profile.",
          },
          {
            title: "Seller products",
            href: "/account/products",
            body: "Post products with images, categories, prices, and stock.",
          },
          {
            title: "Orders",
            href: "/account/orders",
            body: "Track your purchases and seller orders from one dashboard.",
          },
          {
            title: "Manage profile",
            href: "/account/profile",
            body: "Update your display name stored in the portable users table.",
          },
          {
            title: "Update password",
            href: "/account/security",
            body: "Change your password through Supabase Auth.",
          },
          {
            title: "Sessions",
            href: "/account/sessions",
            body: "Review your current session and sign out when needed.",
          },
          {
            title: "Delete account",
            href: "/account/delete-account",
            body: "Review account deletion options.",
          },
        ].map((item) => (
          <article
            key={item.href}
            className="border border-[var(--color-border)] bg-[var(--color-cream)] p-4"
          >
            <h3 className="m-0 mb-2 text-[16px]">{item.title}</h3>
            <p className="m-0 text-[14px] text-[var(--color-muted)]">{item.body}</p>
            <Link href={item.href} className="auth-link mt-4 inline-block text-[14px]">
              Open
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
