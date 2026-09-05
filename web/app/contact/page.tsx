import type { Metadata } from "next";
import Link from "next/link";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineClock,
} from "react-icons/hi2";
import { FaTiktok } from "react-icons/fa";
import { MarketingShell } from "@/components/site/marketing-shell";
import { storeInfo } from "@/lib/store";

export const metadata: Metadata = {
  title: `Contact | ${storeInfo.name}`,
  description: `Visit ${storeInfo.flagshipName} in Port Harcourt or reach the ${storeInfo.name} team. ${storeInfo.address}`,
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 50% 40% at 20% 0%, rgba(201,162,39,0.1) 0%, transparent 50%),
              linear-gradient(180deg, #faf8f4 0%, #ffffff 100%)
            `,
          }}
        />
        <div className="relative mx-auto w-[min(920px,100%)] px-6 py-16 md:py-12">
          <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand)] uppercase">
            Contact
          </p>
          <h1 className="mt-3 mb-4 max-w-[18ch] font-[var(--font-display)] text-[clamp(2.2rem,5vw,3rem)] font-normal leading-[1.08] text-[var(--color-ink)]">
            Talk to us in Port Harcourt, Nigeria
          </h1>
          <span className="gold-rule" />
          <p className="mt-6 mb-0 max-w-[36rem] text-[16px] leading-7 text-[var(--color-muted)]">
            Reach our flagship {storeInfo.flagshipName} storefront, get directions,
            or connect on TikTok. Shoppers can browse all products without an
            account — sellers manage their own orders and logistics.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={storeInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-fill inline-flex px-4 py-2 text-[12px] font-semibold tracking-[0.08em] uppercase no-underline"
            >
              Directions
            </a>
            <a
              href={`tel:${storeInfo.phoneTel}`}
              className="inline-flex border border-[var(--color-border)] bg-transparent px-4 py-2 text-[12px] font-semibold tracking-[0.08em] text-[var(--color-ink)] uppercase no-underline hover:border-[var(--color-brand)]"
            >
              Call
            </a>
            <a
              href={storeInfo.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-[var(--color-border)] bg-transparent px-4 py-2 text-[12px] font-semibold tracking-[0.08em] text-[var(--color-ink)] uppercase no-underline hover:border-[var(--color-brand)]"
            >
              TikTok
            </a>
            <Link
              href="/products"
              className="inline-flex border border-[var(--color-border)] bg-transparent px-4 py-2 text-[12px] font-semibold tracking-[0.08em] text-[var(--color-ink)] uppercase no-underline hover:border-[var(--color-brand)]"
            >
              Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(920px,100%)] gap-12 px-6 py-14 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <h2 className="m-0 mb-6 font-[var(--font-display)] text-[28px] font-normal text-[var(--color-ink)]">
            Flagship store
          </h2>
          <ul className="m-0 list-none space-y-6 p-0">
            <li className="flex gap-3 border-b border-[var(--color-border)] pb-5">
              <HiOutlineMapPin
                className="mt-0.5 shrink-0 text-[22px] text-[var(--color-brand)]"
                aria-hidden
              />
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
                  Address
                </p>
                <p className="mt-2 mb-0 text-[16px] leading-7 text-[var(--color-ink)]">
                  {storeInfo.address}
                </p>
              </div>
            </li>
            <li className="flex gap-3 border-b border-[var(--color-border)] pb-5">
              <HiOutlinePhone
                className="mt-0.5 shrink-0 text-[22px] text-[var(--color-brand)]"
                aria-hidden
              />
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
                  Phone
                </p>
                <a
                  href={`tel:${storeInfo.phoneTel}`}
                  className="mt-2 inline-block text-[16px] text-[var(--color-ink)] no-underline hover:text-[var(--color-brand)]"
                >
                  {storeInfo.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-3 border-b border-[var(--color-border)] pb-5">
              <HiOutlineClock
                className="mt-0.5 shrink-0 text-[22px] text-[var(--color-brand)]"
                aria-hidden
              />
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
                  Hours
                </p>
                <p className="mt-2 mb-0 text-[16px] text-[var(--color-ink)]">
                  {storeInfo.hours}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <FaTiktok
                className="mt-0.5 shrink-0 text-[20px] text-[var(--color-brand)]"
                aria-hidden
              />
              <div>
                <p className="m-0 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-brand)] uppercase">
                  Official TikTok
                </p>
                <a
                  href={storeInfo.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[16px] text-[var(--color-ink)] no-underline hover:text-[var(--color-brand)]"
                >
                  {storeInfo.tiktokHandle}
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
          <div>
            <h2 className="m-0 mb-3 font-[var(--font-display)] text-[26px] font-normal text-[var(--color-ink)]">
              Marketplace support
            </h2>
            <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
              Questions about creating a seller page, listing products, or how
              self-managed logistics work? Call the Port Harcourt store or message
              us on TikTok. Product browsing stays public for every visitor in
              Nigeria.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={storeInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-fill inline-flex items-center justify-center px-5 py-3 text-[13px] font-semibold tracking-[0.06em] uppercase no-underline"
            >
              Open Google Maps directions
            </a>
            <a
              href={`tel:${storeInfo.phoneTel}`}
              className="inline-flex items-center justify-center border border-[var(--color-border)] px-5 py-3 text-[13px] font-semibold tracking-[0.06em] text-[var(--color-ink)] uppercase no-underline hover:border-[var(--color-brand)]"
            >
              Call {storeInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
