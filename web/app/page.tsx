import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineClock,
} from "react-icons/hi2";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { MotionSection } from "@/components/animation/motion-reveal";
import { HeroBrandMotion } from "@/components/hero/hero-brand-motion";
import { CustomerReviewStrip } from "@/components/reviews/customer-review-strip";
import { MarketingShell } from "@/components/site/marketing-shell";
import { storeInfo } from "@/lib/store";

const pillars = [
  {
    title: "Port Harcourt roots",
    body:
      storeInfo.locationLine +
      ". Our flagship, " +
      storeInfo.flagshipName +
      ", serves customers across Nigeria with fragrance and beauty.",
  },
  {
    title: "Fragrance & beauty first",
    body: "Perfumes, body care, and beauty products are at the heart of what we built — made for everyday Nigerian buyers.",
  },
  {
    title: "Open marketplace",
    body: storeInfo.marketplace.body,
  },
];

const sellSteps = [
  {
    step: "01",
    title: "Create your page",
    body: "Register and set up a store page for your brand or business.",
  },
  {
    step: "02",
    title: "List your products",
    body: "Add fragrance, beauty, or other goods. Shoppers can view everything without signing in.",
  },
  {
    step: "03",
    title: "Run your own orders",
    body: storeInfo.marketplace.logistics,
  },
];

export default function Home() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-120px)] items-center overflow-hidden bg-[#f8f3ea]">
        <Image
          src="/hero/fragrance1-hero.jpg"
          alt=""
          fill
          className="pointer-events-none object-cover object-[58%_44%]"
          sizes="100vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-[rgba(10,10,10,0.32)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.52)_0%,rgba(10,10,10,0.38)_42%,rgba(10,10,10,0.18)_78%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.16)_0%,rgba(10,10,10,0.08)_38%,rgba(255,255,255,0.1)_100%)]" />

        <HeroBrandMotion locationLine={storeInfo.locationLine} />
      </section>

      {/* Atmosphere strip */}
      <MotionSection className="overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-black)] py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6">
          {storeInfo.categories.map((item) => (
            <span
              key={item}
              data-aos="fade-up"
              className="text-[12px] font-medium tracking-[0.22em] text-[var(--color-brand)] uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </MotionSection>

      {/* About */}
      <MotionSection id="about" className="scroll-mt-24 border-b border-[var(--color-border)]">
        <div className="mx-auto grid w-[min(1100px,100%)] gap-12 px-6 py-20 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div data-aos="fade-right">
            <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand-deep)] uppercase">
              About {storeInfo.name}
            </p>
            <h2 className="mt-4 mb-0 max-w-[14ch] font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.4rem)] font-normal leading-[1.05] text-[var(--color-ink)]">
              Built in Port Harcourt for Nigeria&apos;s scent &amp; beauty market
            </h2>
            <span className="gold-rule mt-6" />
          </div>
          <p data-aos="fade-left" className="m-0 text-[16px] leading-8 text-[var(--color-muted)]">
            {storeInfo.focus} Today we are also a marketplace where sellers create
            store pages, list products, and reach shoppers nationwide.
          </p>
        </div>
      </MotionSection>

      {/* Pillars */}
      <MotionSection className="mx-auto grid w-[min(1100px,100%)] gap-12 px-6 py-20 md:py-14 lg:grid-cols-3">
        {pillars.map((item, index) => (
          <article
            key={item.title}
            data-aos="fade-up"
            data-aos-delay={index * 90}
            className="border-t border-[var(--color-brand)] pt-6"
          >
            <h3 className="m-0 mb-3 font-[var(--font-display)] text-[26px] font-normal text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
              {item.body}
            </p>
          </article>
        ))}
      </MotionSection>

      {/* Flagship story */}
      <MotionSection className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(201,162,39,0.12) 0%, transparent 55%)",
          }}
        />
        <div data-aos="fade-up" className="relative mx-auto w-[min(920px,100%)] px-6 py-20 md:py-16">
          <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand-deep)] uppercase">
            Flagship
          </p>
          <h2 className="mt-3 mb-5 font-[var(--font-display)] text-[clamp(2rem,4vw,2.8rem)] font-normal text-[var(--color-ink)]">
            {storeInfo.flagshipName}
          </h2>
          <p className="m-0 max-w-[42rem] text-[16px] leading-8 text-[var(--color-muted)]">
            {storeInfo.about}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {storeInfo.categories.map((category) => (
              <span
                key={category}
                className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] tracking-[0.04em] text-[var(--color-brand-deep)]"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Shop CTA band */}
      <MotionSection className="border-b border-[var(--color-border)] bg-[var(--color-black)] text-white">
        <div className="mx-auto flex w-[min(1100px,100%)] flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center md:py-14">
          <div data-aos="fade-right">
            <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand)] uppercase">
              Guest shopping
            </p>
            <h2 className="mt-3 mb-0 max-w-[18ch] font-[var(--font-display)] text-[clamp(1.9rem,4vw,2.6rem)] font-normal leading-tight">
              Browse every listing. No account needed.
            </h2>
          </div>
          <Link
            href="/products"
            data-aos="fade-left"
            className="brand-fill inline-flex shrink-0 px-7 py-3.5 text-[13px] font-semibold tracking-[0.12em] uppercase no-underline"
          >
            Open the shop
          </Link>
        </div>
      </MotionSection>

      {/* How selling works */}
      <MotionSection id="sell" className="scroll-mt-24 border-b border-[var(--color-border)]">
        <div className="mx-auto w-[min(1100px,100%)] px-6 py-20 md:py-16">
          <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand-deep)] uppercase">
            Marketplace
          </p>
          <h2 className="mt-3 mb-3 font-[var(--font-display)] text-[clamp(2rem,4vw,2.8rem)] font-normal text-[var(--color-ink)]">
            How selling works
          </h2>
          <p className="m-0 mb-12 max-w-[40rem] text-[16px] leading-7 text-[var(--color-muted)]">
            {storeInfo.marketplace.categories}
          </p>
          <ol className="m-0 grid list-none gap-10 p-0 lg:grid-cols-3">
            {sellSteps.map((item, index) => (
              <li key={item.step} data-aos="fade-up" data-aos-delay={index * 120}>
                <p className="brand-text m-0 font-[var(--font-display)] text-[32px]">
                  {item.step}
                </p>
                <h3 className="mt-2 mb-2 font-[var(--font-display)] text-[22px] font-normal text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </MotionSection>

      <CustomerReviewStrip />

      {/* Visit / contact */}
      <MotionSection id="visit" className="scroll-mt-24">
        <div className="mx-auto grid w-[min(1100px,100%)] gap-12 px-6 py-20 md:py-16 lg:grid-cols-2">
          <div data-aos="fade-right">
            <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand-deep)] uppercase">
              Visit
            </p>
            <h2 className="mt-3 mb-6 font-[var(--font-display)] text-[clamp(2rem,4vw,2.8rem)] font-normal text-[var(--color-ink)]">
              Port Harcourt storefront
            </h2>
            <ul className="m-0 list-none space-y-5 p-0">
              <li className="flex gap-3">
                <HiOutlineMapPin
                  className="mt-0.5 shrink-0 text-[20px] text-[var(--color-brand)]"
                  aria-hidden
                />
                <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
                  {storeInfo.address}
                </p>
              </li>
              <li className="flex gap-3">
                <HiOutlinePhone
                  className="mt-0.5 shrink-0 text-[20px] text-[var(--color-brand)]"
                  aria-hidden
                />
                <a
                  href={`tel:${storeInfo.phoneTel}`}
                  className="text-[15px] text-[var(--color-ink)] no-underline hover:text-[var(--color-brand-deep)]"
                >
                  {storeInfo.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <HiOutlineClock
                  className="mt-0.5 shrink-0 text-[20px] text-[var(--color-brand)]"
                  aria-hidden
                />
                <p className="m-0 text-[15px] text-[var(--color-muted)]">
                  {storeInfo.hours}
                </p>
              </li>
              <li className="flex gap-3">
                <FaTiktok
                  className="mt-0.5 shrink-0 text-[18px] text-[var(--color-brand)]"
                  aria-hidden
                />
                <a
                  href={storeInfo.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-[var(--color-ink)] no-underline hover:text-[var(--color-brand-deep)]"
                >
                  {storeInfo.tiktokHandle}
                </a>
              </li>
            </ul>
          </div>

          <div data-aos="fade-left" className="flex flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <div>
              <h3 className="m-0 mb-3 font-[var(--font-display)] text-[26px] font-normal text-[var(--color-ink)]">
                Come through — or shop online
              </h3>
              <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
                Find us on Woji Road anytime, or search the full catalog from
                anywhere in Nigeria. Cart stays on your device until you check
                out.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={storeInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-fill inline-flex flex-1 items-center justify-center px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase no-underline"
              >
                Directions
              </a>
              <Link
                href="/products"
                className="brand-outline inline-flex flex-1 items-center justify-center px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase no-underline"
              >
                Shop online
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>
    </MarketingShell>
  );
}
