"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingCart,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { SashaLogo } from "@/components/brand/sasha-logo";
import { HeaderSearch } from "@/components/site/header-search";
import { AccountMenu } from "@/components/site/account-menu";
import { useCart } from "@/lib/cart/cart-context";

function SearchFallback() {
  return (
    <div className="mx-auto h-11 w-full max-w-[560px] border border-[var(--color-border)] bg-[var(--color-surface)]" />
  );
}

const iconBtn =
  "relative inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-border)] text-[22px] text-[var(--color-brand-light)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-[100] overflow-hidden bg-[rgba(10,10,10,0.38)] backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-[position:58%_0%] opacity-45"
        style={{ backgroundImage: "url('/hero/fragrance1-hero.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[rgba(10,10,10,0.36)]" />
      <div className="relative mx-auto grid w-[min(1200px,100%)] grid-cols-[1fr_minmax(0,560px)_1fr] items-center gap-3 px-6 py-3 max-[768px]:grid-cols-[auto_minmax(0,1fr)_auto] max-[768px]:px-4">
        <div className="justify-self-start">
          <SashaLogo
            href="/"
            size={34}
            markClassName="opacity-55 saturate-75"
            wordmarkClassName="text-[20px] max-[640px]:hidden"
          />
        </div>

        <div className="min-w-0 w-full justify-self-center">
          <Suspense fallback={<SearchFallback />}>
            <HeaderSearch />
          </Suspense>
        </div>

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <Link
            href="/contact"
            aria-label="Contact us"
            aria-current={pathname.startsWith("/contact") ? "page" : undefined}
            className={`${iconBtn}${
              pathname.startsWith("/contact")
                ? " border-[var(--color-brand)] text-[var(--color-brand)]"
                : ""
            }`}
          >
            <HiOutlineChatBubbleLeftRight aria-hidden strokeWidth={1.5} />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
            aria-current={pathname.startsWith("/cart") ? "page" : undefined}
            className={`${iconBtn}${
              pathname.startsWith("/cart")
                ? " border-[var(--color-brand)] text-[var(--color-brand)]"
                : ""
            }`}
          >
            <HiOutlineShoppingCart aria-hidden strokeWidth={1.5} />
            {itemCount > 0 ? (
              <span className="brand-fill absolute -top-1.5 -right-1.5 min-w-[18px] rounded-full px-1 text-center text-[10px] leading-[18px] font-semibold">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>

          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
