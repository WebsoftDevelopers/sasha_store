import type { ProductSort } from "@/lib/api/products-api";

export const CATALOG_CATEGORIES = [
  "Fragrance",
  "Perfume",
  "Body care",
  "Beauty",
  "Other",
] as const;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name A–Z" },
];

export type CatalogQuery = {
  q?: string;
  category?: string;
  sort?: ProductSort;
  minPrice?: string;
  maxPrice?: string;
};

export function buildCatalogHref(params: CatalogQuery): string {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.category) sp.set("category", params.category);
  if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
  if (params.minPrice?.trim()) sp.set("minPrice", params.minPrice.trim());
  if (params.maxPrice?.trim()) sp.set("maxPrice", params.maxPrice.trim());
  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}
