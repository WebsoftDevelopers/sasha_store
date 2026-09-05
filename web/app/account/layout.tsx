import { ReactNode } from "react";
import Link from "next/link";
import { SashaLogo } from "@/components/brand/sasha-logo";

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/shop", label: "Shop" },
  { href: "/account/products", label: "Products" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/security", label: "Security" },
  { href: "/account/sessions", label: "Sessions" },
  { href: "/account/delete-account", label: "Delete account" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <div className="mx-auto grid w-[min(1120px,100%)] grid-cols-[260px_1fr] items-start gap-6 lg:grid-cols-1">
        <aside className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <SashaLogo size={36} wordmarkClassName="brand-text text-[18px]" />
          <p className="mt-4 mb-5 text-[13px] leading-5 text-[var(--color-muted)]">
            Manage your shop, products, orders, profile, and security.
          </p>
          <nav className="grid gap-1" aria-label="Account navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block border border-transparent px-3 py-2.5 text-[14px] text-[var(--color-ink)] no-underline transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-cream)] hover:text-[var(--color-brand)]"
              >
                {item.label}
              </Link>
            ))}
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="mt-2 w-full border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-left text-[14px] text-[var(--color-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                Logout
              </button>
            </form>
          </nav>
        </aside>
        <section className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:px-[22px]">
          {children}
        </section>
      </div>
    </main>
  );
}
