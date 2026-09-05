import { getApiBaseUrl } from "@/lib/supabase/env";

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  const response = await fetch(
    `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    },
  );

  if (!response.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message || `Request failed (${response.status})`;
    throw new ApiError(response.status, message, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      token,
    }),
  put: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
      token,
    }),
  patch: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
      token,
    }),
  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: "DELETE", token }),
};
