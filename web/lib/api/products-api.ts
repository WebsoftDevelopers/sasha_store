import { apiClient } from "./api-client";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  category: string | null;
  imageUrl: string | null;
  stock?: number;
  createdAt: string;
  shop?: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
    city?: string;
    state?: string;
  };
  _count?: { ratings: number };
  averageRating?: number | null;
  ratings?: {
    id: string;
    score: number;
    comment: string | null;
    user?: {
      id: string;
      fullName: string | null;
    };
  }[];
};

export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc";

export type ListProductsParams = {
  q?: string;
  category?: string;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

export type ProductsListResponse = {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
};

function toQuery(params: ListProductsParams): string {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.category) sp.set("category", params.category);
  if (params.sort) sp.set("sort", params.sort);
  if (params.minPrice != null && !Number.isNaN(params.minPrice)) {
    sp.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice != null && !Number.isNaN(params.maxPrice)) {
    sp.set("maxPrice", String(params.maxPrice));
  }
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const productsApi = {
  list: (params: ListProductsParams = {}) =>
    apiClient.get<ProductsListResponse>(`/api/products${toQuery(params)}`),
  get: (id: string) => apiClient.get<Product>(`/api/products/${id}`),
  mine: (token: string) => apiClient.get<Product[]>("/api/products/mine", token),
  create: (token: string, data: CreateProductInput) =>
    apiClient.post<Product>("/api/products", data, token),
};
