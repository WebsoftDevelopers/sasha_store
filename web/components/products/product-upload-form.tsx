"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { uploadProductImage } from "@/lib/api/storage-api";
import { productsApi } from "@/lib/api/products-api";

type Props = {
  onCreated?: () => void;
};

export function ProductUploadForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [category, setCategory] = useState("Fragrance");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onFileChange = (selected: File | null) => {
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!name.trim() || !price) {
      setError("Name and price are required");
      return;
    }

    setBusy(true);
    setUploadStatus(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token || !session.user?.id) {
        throw new Error("Sign in to upload products");
      }

      let imageUrl: string | undefined;
      if (file) {
        const uploaded = await uploadProductImage(
          file,
          session.user.id,
          session.access_token,
          (progress) => {
            setUploadStatus(progress.message);
          },
        );
        imageUrl = uploaded.url;
        setUploadStatus(
          `Compressed ${uploaded.originalSizeMb}MB → ${uploaded.compressedSizeMb}MB`,
        );
      }

      await productsApi.create(session.access_token, {
        name: name.trim(),
        price: Number(price),
        stock: Math.max(0, Number(stock) || 0),
        category: category || undefined,
        description: description.trim() || undefined,
        imageUrl,
      });

      setName("");
      setPrice("");
      setStock("1");
      setDescription("");
      setFile(null);
      setPreview(null);
      setMessage(
        "Product saved. Image was compressed on-device and uploaded to your storage; only the URL is stored.",
      );
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[22px] font-normal">
        Add a product
      </h2>
      <p className="m-0 mb-5 text-[13px] text-[var(--color-muted)]">
        Images are compressed on your device, then uploaded straight to
        your storage. The API only saves the URL.
      </p>

      <label className="auth-label" htmlFor="product-name">
        Name
      </label>
      <input
        id="product-name"
        className="auth-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={busy}
      />

      <label className="auth-label" htmlFor="product-price">
        Price (NGN)
      </label>
      <input
        id="product-price"
        type="number"
        min="0"
        step="0.01"
        className="auth-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={busy}
      />

      <label className="auth-label" htmlFor="product-category">
        Category
      </label>
      <select
        id="product-category"
        className="auth-input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={busy}
      >
        <option>Fragrance</option>
        <option>Perfume</option>
        <option>Body care</option>
        <option>Beauty</option>
        <option>Other</option>
      </select>

      <label className="auth-label" htmlFor="product-stock">
        Stock
      </label>
      <input
        id="product-stock"
        type="number"
        min="0"
        step="1"
        className="auth-input"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        disabled={busy}
      />

      <label className="auth-label" htmlFor="product-description">
        Description
      </label>
      <textarea
        id="product-description"
        className="auth-input min-h-[88px] py-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={busy}
      />

      <label className="auth-label" htmlFor="product-image">
        Image
      </label>
      <input
        id="product-image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={busy}
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Preview"
          className="mt-3 h-36 w-36 object-cover border border-[var(--color-border)]"
        />
      ) : null}

      {uploadStatus ? (
        <p className="mt-3 text-[13px] text-[var(--color-muted)]">{uploadStatus}</p>
      ) : null}
      {error ? <p className="auth-error">{error}</p> : null}
      {message ? (
        <p className="mt-3 text-[14px] text-[var(--color-success)]">{message}</p>
      ) : null}

      <button type="submit" className="auth-button max-w-[240px]" disabled={busy}>
        {busy ? "Compressing / uploading..." : "Compress, upload & save"}
      </button>
    </form>
  );
}
