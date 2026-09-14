import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_IMAGE_UPLOAD = "/image/upload/";

function addLegacyCloudinaryTransforms(
  src: string,
  width: number,
  quality?: number,
) {
  if (
    !src.includes("res.cloudinary.com") ||
    !src.includes(CLOUDINARY_IMAGE_UPLOAD)
  ) {
    return src;
  }

  const [base, suffix] = src.split(CLOUDINARY_IMAGE_UPLOAD);
  if (!base || !suffix) return src;

  const transforms = [
    "f_auto",
    `q_${quality || "auto"}`,
    "c_limit",
    `w_${width}`,
    "dpr_auto",
  ].join(",");

  return `${base}${CLOUDINARY_IMAGE_UPLOAD}${transforms}/${suffix}`;
}

export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return addLegacyCloudinaryTransforms(src, width, quality);
}
