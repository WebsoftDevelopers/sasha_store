import { apiClient } from "./api-client";
import type { Shop } from "./shops-api";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string | number;
  name: string;
};

export type Order = {
  id: string;
  buyerId: string;
  shopId: string;
  status: OrderStatus;
  totalAmount: string | number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPhone: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shop?: Pick<Shop, "id" | "name" | "slug" | "isVerified" | "phone">;
  buyer?: {
    id: string;
    fullName: string | null;
    email: string;
  };
};

export type DashboardResponse = {
  shop: (Shop & { _count?: { products: number; orders: number } }) | null;
  stats: {
    products: number;
    purchases: number;
    sales: number;
  };
};

export type CreateOrderInput = {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPhone: string;
  notes?: string;
};

export const ordersApi = {
  dashboard: (token: string) =>
    apiClient.get<DashboardResponse>("/api/orders/dashboard", token),
  purchases: (token: string) => apiClient.get<Order[]>("/api/orders/purchases", token),
  sales: (token: string) => apiClient.get<Order[]>("/api/orders/sales", token),
  create: (token: string, data: CreateOrderInput) =>
    apiClient.post<Order>("/api/orders", data, token),
  updateSaleStatus: (token: string, orderId: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/api/orders/sales/${orderId}/status`, { status }, token),
};
