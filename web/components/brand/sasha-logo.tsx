import Image from "next/image";
import Link from "next/link";

type SashaLogoProps = {
  href?: string;
  src?: string;
  size?: number;
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  wordmarkGradient?: boolean;
};

export function SashaLogo({
  href = "/",
  src = "/brand/shasha-logo-transparent.png",
  size = 40,
  showWordmark = true,
  className = "",
  markClassName = "",
  wordmarkClassName = "",
  wordmarkGradient = true,
}: SashaLogoProps) {
  const wordmarkClasses = [
    "font-[var(--font-display)] font-semibold tracking-[0.04em]",
    wordmarkGradient ? "brand-text" : "text-[var(--color-ink)]",
    wordmarkClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const mark = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={`h-auto shrink-0 ${markClassName}`}
        priority
      />
      {showWordmark ? (
        <span className={wordmarkClasses}>
          Shasha Fragrance
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex text-inherit no-underline">
      {mark}
    </Link>
  );
}
