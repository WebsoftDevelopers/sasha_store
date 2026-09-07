"use client";

import { ChangeEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import {
  uploadProductImage,
  type UploadResult,
} from "@/lib/api/storage-api";

type Props = {
  /** Overrides session user id when provided */
  userId?: string;
  onUploaded?: (result: UploadResult) => void;
  label?: string;
  disabled?: boolean;
};

/**
 * Client-only: compress on device, then upload to Cloudinary under userId/.
 */
export function CloudinaryUpload({
  userId: userIdProp,
  onUploaded,
  label = "Image",
  disabled = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setStatus("");
    setUploadedUrl("");
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select an image file first.");
      return;
    }

    setBusy(true);
    try {
      let userId = userIdProp?.trim() || "";
      let token = "";
      if (!userId) {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        userId = session?.user?.id || "";
        token = session?.access_token || "";
      }
      if (!userId) {
        throw new Error("Sign in required — uploads go under your user folder");
      }

      const result = await uploadProductImage(file, userId, token, (progress) => {
        setStatus(progress.message);
      });
      setUploadedUrl(result.url);
      setStatus(
        `Done. ${result.originalSizeMb}MB → ${result.compressedSizeMb}MB`,
      );
      onUploaded?.(result);
    } catch (error) {
      console.error(error);
      setStatus(
        error instanceof Error
          ? error.message
          : "Compression or upload failed",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <label className="auth-label" htmlFor="cloudinary-file">
        {label}
      </label>
      <input
        id="cloudinary-file"
        type="file"
        accept="image/*"
        disabled={disabled || busy}
        onChange={handleFileChange}
        className="block w-full text-[13px]"
      />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="mt-3 h-32 w-32 border border-[var(--color-border)] object-cover"
        />
      ) : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || busy || disabled}
        className="auth-button mt-4 max-w-[220px]"
      >
        {busy ? "Working..." : "Compress & upload"}
      </button>

      {status ? (
        <p className="mt-3 text-[13px] font-medium text-[var(--color-muted)]">
          {status}
        </p>
      ) : null}

      {uploadedUrl ? (
        <a
          href={uploadedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="auth-link mt-2 inline-block break-all text-[12px]"
        >
          {uploadedUrl}
        </a>
      ) : null}
    </div>
  );
}
