"use client";

import imageCompression from "browser-image-compression";
import { apiClient } from "./api-client";
import { getApiBaseUrl } from "@/lib/supabase/env";

export type UploadResult = {
  url: string;
  publicId: string;
  assetId?: string;
  originalSizeMb: string;
  compressedSizeMb: string;
};

export type MediaAssetType = "IMAGE" | "VIDEO" | "DOCUMENT" | "BLOB";

export type MediaAsset = {
  id: string;
  ownerId: string;
  assetType: MediaAssetType;
  context: string | null;
  entityType: string | null;
  entityId: string | null;
  url: string;
  secureUrl: string | null;
  publicId: string;
  resourceType: string;
  format: string | null;
  mimeType: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
  provider: string;
  folder: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UploadProgress = {
  stage: "compressing" | "uploading" | "done";
  message: string;
};

async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type.includes("png") ? "image/png" : "image/jpeg",
  });
}

async function uploadImageThroughApi(
  file: File,
  token: string,
  context: string,
): Promise<{ url: string; publicId: string; assetId: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${getApiBaseUrl()}/api/storage/upload?context=${encodeURIComponent(context)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    let message = `Image upload failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      message = Array.isArray(body.message)
        ? body.message.join(", ")
        : body.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<{
    url: string;
    publicId: string;
    assetId: string;
  }>;
}

/**
 * Compress on-device, then upload through the authenticated API. The API stores
 * the object in self-hosted MinIO and records media metadata for the user.
 */
export async function uploadProductImage(
  file: File,
  userId: string,
  token?: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  if (!userId?.trim()) {
    throw new Error("userId is required for per-user storage folders");
  }
  if (!token) {
    throw new Error("Sign in required to upload product images");
  }

  onProgress?.({
    stage: "compressing",
    message: "Compressing image on your device...",
  });

  const compressedFile = await compressImage(file);
  const originalSizeMb = (file.size / 1024 / 1024).toFixed(2);
  const compressedSizeMb = (compressedFile.size / 1024 / 1024).toFixed(2);

  onProgress?.({
    stage: "uploading",
    message: `Reduced ${originalSizeMb}MB → ${compressedSizeMb}MB. Uploading securely...`,
  });

  const data = await uploadImageThroughApi(compressedFile, token, "product");

  onProgress?.({
    stage: "done",
    message: "Upload complete",
  });

  return {
    url: data.url,
    publicId: data.publicId,
    assetId: data.assetId,
    originalSizeMb,
    compressedSizeMb,
  };
}

export async function uploadVendorAsset(
  file: File,
  userId: string,
  kind: string,
  token?: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  if (!userId?.trim()) {
    throw new Error("userId is required for per-user storage folders");
  }

  const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (!allowed.includes(file.type)) {
    throw new Error("Vendor documents must be PDF, PNG, JPG, or JPEG.");
  }

  const originalSizeMb = (file.size / 1024 / 1024).toFixed(2);
  let uploadFile = file;

  if (file.type.startsWith("image/")) {
    onProgress?.({
      stage: "compressing",
      message: "Compressing image on your device...",
    });
    uploadFile = await compressImage(file);
  }

  const compressedSizeMb = (uploadFile.size / 1024 / 1024).toFixed(2);
  onProgress?.({
    stage: "uploading",
    message: `Uploading ${file.type === "application/pdf" ? "PDF" : "image"} securely...`,
  });

  if (!token) {
    throw new Error("Sign in required to upload vendor files");
  }
  const data = await uploadImageThroughApi(uploadFile, token, `vendor:${kind}`);

  onProgress?.({ stage: "done", message: "Upload complete" });

  return {
    url: data.url,
    publicId: data.publicId,
    assetId: data.assetId,
    originalSizeMb,
    compressedSizeMb,
  };
}

export function recordMediaAsset(
  token: string,
  data: {
    assetType: MediaAssetType;
    context?: string;
    entityType?: string;
    entityId?: string;
    url: string;
    secureUrl?: string;
    publicId: string;
    resourceType: string;
    format?: string;
    mimeType?: string;
    bytes?: number;
    width?: number;
    height?: number;
    folder?: string;
    metadata?: Record<string, unknown>;
  },
) {
  return apiClient.post<MediaAsset>("/api/storage/assets", data, token);
}

export const mediaAssetsApi = {
  mine: (token: string, context?: string) =>
    apiClient.get<MediaAsset[]>(
      `/api/storage/assets${context ? `?context=${encodeURIComponent(context)}` : ""}`,
      token,
    ),
  record: recordMediaAsset,
};
