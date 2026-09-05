import Link from "next/link";
import { FaTiktok } from "react-icons/fa";
import { SashaLogo } from "@/components/brand/sasha-logo";
import { storeInfo } from "@/lib/store";

const footerLinks = [
  { href: "/products", label: "Shop" },
  { href: "/#about", label: "About" },
  { href: "/#visit", label: "Visit" },
  { href: "/contact", label: "Contact us" },
  { href: "/cart", label: "Cart" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-brand)]/30 bg-[var(--color-black)] text-white">
      <div className="mx-auto grid w-[min(1100px,100%)] gap-10 px-6 py-16 md:grid-cols-1 md:gap-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <SashaLogo
            size={40}
            wordmarkClassName="brand-text text-[22px]"
          />
          <p className="mt-5 mb-0 max-w-[28rem] text-[14px] leading-7 text-white/65">
            {storeInfo.locationLine}. Built around fragrance, perfumes, body
            care, and beauty — with room for sellers across Nigeria and beyond
            cosmetics.
          </p>
        </div>

        <div>
          <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[var(--color-brand)] uppercase">
            Explore
          </p>
          <ul className="mt-5 list-none space-y-3 p-0">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[14px] text-white/70 no-underline transition-colors hover:text-[var(--color-brand)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="m-0 text-[11px] font-semibold tracking-[0.18em] text-[var(--color-brand)] uppercase">
            Visit &amp; call
          </p>
          <p className="mt-5 mb-2 text-[14px] leading-7 text-white/70">
            {storeInfo.address}
          </p>
          <a
            href={`tel:${storeInfo.phoneTel}`}
            className="text-[14px] text-white no-underline hover:text-[var(--color-brand)]"
          >
            {storeInfo.phoneDisplay}
          </a>
          <p className="mt-2 mb-5 text-[13px] text-white/55">{storeInfo.hours}</p>
          <a
            href={storeInfo.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] text-[var(--color-brand)] no-underline hover:text-[var(--color-brand-hover)]"
          >
            <FaTiktok aria-hidden />
            {storeInfo.tiktokHandle}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-[11px] tracking-[0.06em] text-white/45 uppercase">
        © {new Date().getFullYear()} {storeInfo.name}. Flagship store{" "}
        {storeInfo.flagshipName}, Port Harcourt.
      </div>
    </footer>
  );
}
