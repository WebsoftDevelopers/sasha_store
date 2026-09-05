import { apiClient } from "./api-client";
import type { Product } from "./products-api";

export type Shop = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  legalName: string;
  cacNumber: string;
  tin: string | null;
  businessAddress: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  isVerified: boolean;
  verificationNote: string | null;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  _count?: {
    products?: number;
    orders?: number;
  };
};

export type CreateShopInput = {
  name: string;
  description?: string;
  logoUrl?: string;
  legalName: string;
  cacNumber: string;
  tin?: string;
  businessAddress: string;
  city: string;
  state: string;
  phone: string;
  email: string;
};

export const shopsApi = {
  mine: (token: string) => apiClient.get<Shop | null>("/api/shops/me", token),
  create: (token: string, data: CreateShopInput) =>
    apiClient.post<Shop>("/api/shops", data, token),
  updateMine: (token: string, data: Partial<CreateShopInput>) =>
    apiClient.patch<Shop>("/api/shops/me", data, token),
  bySlug: (slug: string) => apiClient.get<Shop>(`/api/shops/slug/${slug}`),
};
