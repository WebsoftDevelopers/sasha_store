import { apiClient } from "./api-client";
import type { Product } from "./products-api";

export type Shop = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  category: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  alternativePhone: string | null;
  identificationType: string | null;
  identificationNumber: string | null;
  legalName: string;
  registeredBusinessName: string | null;
  cacNumber: string;
  businessRegistrationType: string | null;
  tin: string | null;
  registrationDate: string | null;
  businessAddress: string;
  country: string | null;
  city: string;
  state: string;
  lga: string | null;
  streetAddress: string | null;
  postalCode: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  phone: string;
  email: string;
  businessPhone: string | null;
  businessEmail: string | null;
  website: string | null;
  socialLinks: string[] | null;
  cacDocumentUrl: string | null;
  idDocumentUrl: string | null;
  proofOfAddressUrl: string | null;
  businessRegistrationDocumentUrl: string | null;
  taxCertificateUrl: string | null;
  additionalDocumentUrls: string[] | null;
  vendorStatus: VendorStatus;
  isVerified: boolean;
  adminComment: string | null;
  rejectionReason: string | null;
  missingDocuments: string[] | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  owner?: {
    id: string;
    email: string;
    fullName: string | null;
  };
  _count?: {
    products?: number;
    orders?: number;
  };
};

export type VendorStatus =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "DISABLED";

export type CreateShopInput = {
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  category?: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhone: string;
  alternativePhone?: string;
  identificationType: string;
  identificationNumber: string;
  legalName: string;
  registeredBusinessName?: string;
  cacNumber: string;
  businessRegistrationType?: string;
  tin?: string;
  registrationDate?: string;
  businessAddress: string;
  country?: string;
  city: string;
  state: string;
  lga?: string;
  streetAddress?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  socialLinks?: string[];
  cacDocumentUrl?: string;
  idDocumentUrl?: string;
  proofOfAddressUrl?: string;
  businessRegistrationDocumentUrl?: string;
  taxCertificateUrl?: string;
  additionalDocumentUrls?: string[];
};

export const shopsApi = {
  mine: (token: string) => apiClient.get<Shop | null>("/api/shops/me", token),
  create: (token: string, data: CreateShopInput) =>
    apiClient.post<Shop>("/api/shops", data, token),
  updateMine: (token: string, data: Partial<CreateShopInput>) =>
    apiClient.patch<Shop>("/api/shops/me", data, token),
  resubmit: (token: string, data: Partial<CreateShopInput>) =>
    apiClient.post<Shop>("/api/shops/me/resubmit", data, token),
  bySlug: (slug: string) => apiClient.get<Shop>(`/api/shops/slug/${slug}`),
  adminList: (token: string, status?: VendorStatus) =>
    apiClient.get<Shop[]>(
      `/api/shops/admin${status ? `?status=${status}` : ""}`,
      token,
    ),
  adminDetail: (token: string, id: string) =>
    apiClient.get<Shop>(`/api/shops/admin/${id}`, token),
  approve: (token: string, id: string, note?: string) =>
    apiClient.post<Shop>(`/api/shops/admin/${id}/approve`, { note }, token),
  reject: (
    token: string,
    id: string,
    data: { reason?: string; comment?: string; missingDocuments?: string[] },
  ) => apiClient.post<Shop>(`/api/shops/admin/${id}/reject`, data, token),
  suspend: (token: string, id: string, comment?: string) =>
    apiClient.post<Shop>(`/api/shops/admin/${id}/suspend`, { comment }, token),
  disable: (token: string, id: string, comment?: string) =>
    apiClient.post<Shop>(`/api/shops/admin/${id}/disable`, { comment }, token),
};
