import { apiClient } from "./api-client";

export type Rating = {
  id: string;
  productId: string;
  userId: string;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string | null;
  };
  product?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export const ratingsApi = {
  forProduct: (productId: string) =>
    apiClient.get<Rating[]>(`/api/ratings/product/${productId}`),
  forMyShop: (token: string) => apiClient.get<Rating[]>("/api/ratings/mine/shop", token),
  upsert: (token: string, data: { productId: string; score: number; comment?: string }) =>
    apiClient.post<Rating>("/api/ratings", data, token),
};
