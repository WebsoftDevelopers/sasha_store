import { apiClient } from "./api-client";

export type AppUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  authProvider: "email" | "google";
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "DISABLED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export const authApi = {
  me: (token: string) => apiClient.get<AppUser>("/api/auth/me", token),
  updateProfile: (
    token: string,
    data: { fullName?: string; avatarUrl?: string },
  ) => apiClient.patch<AppUser>("/api/users/me", data, token),
  logoutAck: (token: string) =>
    apiClient.post<{ message: string }>("/api/auth/logout", {}, token),
};
