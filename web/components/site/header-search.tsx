"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { productsApi, type Product } from "@/lib/api/products-api";
import { buildCatalogHref } from "@/lib/catalog";

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const urlQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(urlQ);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const debouncedQ = useDebounced(q.trim(), 280);

  useEffect(() => {
    if (pathname.startsWith("/products")) setQ(urlQ);
  }, [pathname, urlQ]);

  useEffect(() => {
    if (!debouncedQ || debouncedQ.length < 2) {
      setSuggestions([]);
      setSuggestLoading(false);
      return;
    }

    let cancelled = false;
    setSuggestLoading(true);
    void productsApi
      .list({ q: debouncedQ, limit: 6, sort: "newest" })
      .then((res) => {
        if (!cancelled) setSuggestions(res.data);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setSuggestLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setSuggestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = useCallback(
    (query = q) => {
      setSuggestOpen(false);
      router.push(buildCatalogHref({ q: query }));
    },
    [router, q],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go();
  };

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[560px]">
      <form
        onSubmit={onSubmit}
        className="flex h-11 items-stretch overflow-hidden border border-[rgba(201,162,39,0.24)] bg-[rgba(248,243,234,0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md transition-[border-color,box-shadow,background] focus-within:border-[rgba(201,162,39,0.55)] focus-within:bg-[rgba(248,243,234,0.9)] focus-within:shadow-[var(--glow-gold)]"
        role="search"
      >
        <label className="sr-only" htmlFor={`${panelId}-q`}>
          Search products
        </label>
        <div className="relative flex min-w-0 flex-1 items-center">
          <HiOutlineMagnifyingGlass
            className="ml-3 shrink-0 text-[18px] text-[var(--color-muted)]"
            aria-hidden
          />
          <input
            ref={inputRef}
            id={`${panelId}-q`}
            type="search"
            value={q}
            autoComplete="off"
            placeholder="Search fragrance, perfume, beauty…"
            className="h-full w-full min-w-0 border-0 bg-transparent px-3 text-[14px] text-[var(--color-ink)] outline-none placeholder:text-[rgba(107,101,96,0.76)]"
            onChange={(e) => {
              setQ(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
          />
          {q ? (
            <button
              type="button"
              aria-label="Clear search"
              className="mr-1 inline-flex h-8 w-8 items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-brand)]"
              onClick={() => {
                setQ("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <HiOutlineXMark className="text-[18px]" aria-hidden />
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          className="brand-fill inline-flex items-center justify-center px-4 text-[12px] font-semibold tracking-[0.08em] uppercase sm:px-5"
        >
          Search
        </button>
      </form>

      {suggestOpen && (debouncedQ.length >= 2 || suggestLoading) ? (
        <div
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-[120] overflow-hidden border border-[rgba(201,162,39,0.24)] bg-[rgba(248,243,234,0.96)] shadow-[var(--glow-gold)] backdrop-blur-md"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestLoading ? (
            <p className="m-0 px-4 py-3 text-[13px] text-[var(--color-muted)]">
              Searching…
            </p>
          ) : suggestions.length === 0 ? (
            <p className="m-0 px-4 py-3 text-[13px] text-[var(--color-muted)]">
              No matches for &ldquo;{debouncedQ}&rdquo;
            </p>
          ) : (
            <ul className="m-0 list-none p-0">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-inherit no-underline transition-colors hover:bg-[var(--color-cream)]"
                    onClick={() => setSuggestOpen(false)}
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-[var(--color-cream)]">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                          unoptimized={
                            product.imageUrl.includes("picsum.photos") ||
                            product.imageUrl.includes("placehold.co")
                          }
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-[var(--color-ink)]">
                        {product.name}
                      </span>
                      <span className="block truncate text-[11px] text-[var(--color-muted)]">
                        {product.category || "Product"}
                        {product.shop?.name ? ` · ${product.shop.name}` : ""}
                      </span>
                    </span>
                    <span className="brand-text shrink-0 text-[13px] font-semibold">
                      ₦{Number(product.price).toLocaleString("en-NG")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-2.5 text-left text-[12px] font-semibold tracking-[0.06em] text-[var(--color-brand)] uppercase hover:bg-[var(--color-surface-elevated)]"
            onClick={() => go()}
          >
            View all results
            <span aria-hidden>→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
