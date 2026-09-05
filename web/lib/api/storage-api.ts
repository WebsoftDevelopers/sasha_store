"use client";

import imageCompression from "browser-image-compression";

export type UploadResult = {
  url: string;
  publicId: string;
  originalSizeMb: string;
  compressedSizeMb: string;
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

/**
 * Compress on-device, then upload to Cloudinary under:
 *   [{rootFolder}/]{userId}/{filename}
 * e.g. sasha-store/products/abc-uuid/photo-1710000000000
 */
export async function uploadProductImage(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  if (!userId?.trim()) {
    throw new Error("userId is required for per-user Cloudinary folders");
  }

  const { cloudName, uploadPreset, rootFolder } = getCloudinaryConfig();
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

  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

  const data = (await response.json()) as {
    secure_url: string;
    public_id: string;
  };

  onProgress?.({
    stage: "done",
    message: "Upload complete",
  });

  return {
    url: data.secure_url,
    publicId: data.public_id,
    originalSizeMb,
    compressedSizeMb,
  };
}
