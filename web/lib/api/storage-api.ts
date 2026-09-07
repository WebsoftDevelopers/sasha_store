"use client";

import imageCompression from "browser-image-compression";
import { apiClient } from "./api-client";

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

function getCloudinaryConfig() {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || "";
  const rootFolder =
    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER?.trim() || "";

  if (!cloudName || !uploadPreset || cloudName === "your-cloud-name") {
    throw new Error(
      "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (unsigned) in .env",
    );
  }

  return { cloudName, uploadPreset, rootFolder };
}

/** Safe Cloudinary public_id segment from original filename (no extension). */
function sanitizeBaseName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || "image";
}

async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type.includes("png") ? "image/png" : "image/jpeg",
  });
}

async function uploadToCloudinary(
  file: File,
  folder: string,
  publicId: string,
  resourceType: "image" | "raw",
): Promise<{ secure_url: string; public_id: string }> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    let message = `Cloudinary upload failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<{ secure_url: string; public_id: string }>;
}

/**
 * Compress on-device, then upload to Cloudinary under:
 *   [{rootFolder}/]{userId}/{filename}
 * e.g. sasha-store/products/abc-uuid/photo-1710000000000
 */
export async function uploadProductImage(
  file: File,
  userId: string,
  token?: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  if (!userId?.trim()) {
    throw new Error("userId is required for per-user Cloudinary folders");
  }

  const { rootFolder } = getCloudinaryConfig();
  const folder = [rootFolder, userId.trim()].filter(Boolean).join("/");
  const publicId = `${sanitizeBaseName(file.name)}-${Date.now()}`;

  onProgress?.({
    stage: "compressing",
    message: "Compressing image on your device...",
  });

  const compressedFile = await compressImage(file);
  const originalSizeMb = (file.size / 1024 / 1024).toFixed(2);
  const compressedSizeMb = (compressedFile.size / 1024 / 1024).toFixed(2);

  onProgress?.({
    stage: "uploading",
    message: `Reduced ${originalSizeMb}MB → ${compressedSizeMb}MB. Uploading to ${folder}/...`,
  });

  const data = await uploadToCloudinary(compressedFile, folder, publicId, "image");
  const asset = token
    ? await recordMediaAsset(token, {
        assetType: "IMAGE",
        context: "product",
        url: data.secure_url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        resourceType: "image",
        mimeType: compressedFile.type,
        bytes: compressedFile.size,
        folder,
      })
    : null;

  onProgress?.({
    stage: "done",
    message: "Upload complete",
  });

  return {
    url: data.secure_url,
    publicId: data.public_id,
    assetId: asset?.id,
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
    throw new Error("userId is required for per-user Cloudinary folders");
  }

  const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (!allowed.includes(file.type)) {
    throw new Error("Vendor documents must be PDF, PNG, JPG, or JPEG.");
  }

  const { rootFolder } = getCloudinaryConfig();
  const folder = [rootFolder, userId.trim(), "vendor", kind]
    .filter(Boolean)
    .join("/");
  const publicId = `${sanitizeBaseName(file.name)}-${Date.now()}`;
  const originalSizeMb = (file.size / 1024 / 1024).toFixed(2);
  let uploadFile = file;
  let resourceType: "image" | "raw" = "raw";

  if (file.type.startsWith("image/")) {
    resourceType = "image";
    onProgress?.({
      stage: "compressing",
      message: "Compressing image on your device...",
    });
    uploadFile = await compressImage(file);
  }

  const compressedSizeMb = (uploadFile.size / 1024 / 1024).toFixed(2);
  onProgress?.({
    stage: "uploading",
    message: `Uploading ${file.type === "application/pdf" ? "PDF" : "image"} to ${folder}/...`,
  });

  const data = await uploadToCloudinary(
    uploadFile,
    folder,
    publicId,
    resourceType,
  );
  const asset = token
    ? await recordMediaAsset(token, {
        assetType: resourceType === "image" ? "IMAGE" : "DOCUMENT",
        context: `vendor:${kind}`,
        url: data.secure_url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        resourceType,
        mimeType: file.type,
        bytes: uploadFile.size,
        folder,
      })
    : null;

  onProgress?.({ stage: "done", message: "Upload complete" });

  return {
    url: data.secure_url,
    publicId: data.public_id,
    assetId: asset?.id,
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
