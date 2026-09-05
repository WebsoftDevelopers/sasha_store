"use client";

import { useEffect, useState } from "react";
import type { ProductSort } from "@/lib/api/products-api";
import { CATALOG_CATEGORIES, SORT_OPTIONS } from "@/lib/catalog";

type CatalogFiltersSidebarProps = {
  category: string;
  sort: ProductSort;
  minPrice: string;
  maxPrice: string;
  onChange: (patch: Record<string, string | null>) => void;
  onReset: () => void;
};

export function CatalogFiltersSidebar({
  category,
  sort,
  minPrice,
  maxPrice,
  onChange,
  onReset,
}: CatalogFiltersSidebarProps) {
  const [minDraft, setMinDraft] = useState(minPrice);
  const [maxDraft, setMaxDraft] = useState(maxPrice);

  useEffect(() => {
    setMinDraft(minPrice);
    setMaxDraft(maxPrice);
  }, [minPrice, maxPrice]);

  const applyPrice = () => {
    onChange({
      minPrice: minDraft.trim() || null,
      maxPrice: maxDraft.trim() || null,
    });
  };

  return (
    <aside className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="m-0 text-[10px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
          Filters
        </p>
        <button
          type="button"
          className="text-[10px] font-semibold tracking-[0.06em] text-[var(--color-muted)] uppercase hover:text-[var(--color-brand-deep)]"
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <label className="mb-2.5 block text-[11px] text-[var(--color-muted)]">
        Category
        <select
          className="filter-input mt-1"
          value={category}
          onChange={(e) => onChange({ category: e.target.value || null })}
        >
          <option value="">Any</option>
          {CATALOG_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-2.5 block text-[11px] text-[var(--color-muted)]">
        Sort
        <select
          className="filter-input mt-1"
          value={sort}
          onChange={(e) =>
            onChange({
              sort: e.target.value === "newest" ? null : e.target.value,
            })
          }
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-[11px] text-[var(--color-muted)]">
          Min ₦
          <input
            type="number"
            min={0}
            className="filter-input mt-1"
            value={minDraft}
            onChange={(e) => setMinDraft(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPrice();
            }}
            placeholder="0"
          />
        </label>
        <label className="block text-[11px] text-[var(--color-muted)]">
          Max ₦
          <input
            type="number"
            min={0}
            className="filter-input mt-1"
            value={maxDraft}
            onChange={(e) => setMaxDraft(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyPrice();
            }}
            placeholder="Any"
          />
        </label>
      </div>
    </aside>
  );
}
