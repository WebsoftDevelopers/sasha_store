import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/site/marketing-shell";
import { storeInfo } from "@/lib/store";

export const metadata: Metadata = {
  title: `About | ${storeInfo.name}`,
  description: `${storeInfo.focus} ${storeInfo.marketplace.body}`,
};

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

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,162,39,0.12) 0%, transparent 55%),
              linear-gradient(160deg, #ffffff 0%, #faf8f4 100%)
            `,
          }}
        />
        <div className="relative mx-auto w-[min(920px,100%)] px-6 py-20 md:py-14">
          <p className="animate-fade-up m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand)] uppercase">
            About {storeInfo.name}
          </p>
          <h1 className="animate-fade-up-delay-1 mt-4 mb-5 max-w-[16ch] font-[var(--font-display)] text-[clamp(2.4rem,6vw,3.4rem)] font-normal leading-[1.05] text-[var(--color-ink)]">
            Built in Port Harcourt for Nigeria&apos;s scent &amp; beauty market
          </h1>
          <span className="gold-rule" />
          <p className="animate-fade-up-delay-2 mt-6 mb-0 max-w-[38rem] text-[17px] leading-8 text-[var(--color-muted)]">
            {storeInfo.focus} Today we are also a marketplace where sellers create
            store pages, list products, and reach shoppers nationwide.
          </p>
          <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="brand-fill inline-flex px-5 py-2.5 text-[13px] font-semibold tracking-[0.08em] uppercase no-underline"
            >
              Browse products
            </Link>
            <Link
              href="/contact"
              className="brand-outline inline-flex px-5 py-2.5 text-[13px] font-semibold tracking-[0.08em] uppercase no-underline"
            >
              Visit us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(920px,100%)] gap-10 px-6 py-16 md:py-12 lg:grid-cols-3">
        {pillars.map((item) => (
          <div key={item.title} className="border-t border-[var(--color-brand)] pt-5">
            <h2 className="m-0 mb-3 font-[var(--font-display)] text-[24px] font-normal text-[var(--color-ink)]">
              {item.title}
            </h2>
            <p className="m-0 text-[15px] leading-7 text-[var(--color-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto w-[min(920px,100%)] px-6 py-16 md:py-12">
          <h2 className="m-0 mb-3 font-[var(--font-display)] text-[32px] font-normal text-[var(--color-ink)] md:text-[26px]">
            How selling works
          </h2>
          <p className="m-0 mb-10 max-w-[40rem] text-[16px] leading-7 text-[var(--color-muted)]">
            {storeInfo.marketplace.categories}
          </p>
          <ol className="m-0 grid list-none gap-8 p-0 md:grid-cols-1 lg:grid-cols-3">
            {[
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
            ].map((item) => (
              <li key={item.step}>
                <p className="m-0 font-[var(--font-display)] text-[28px] brand-text">
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
      </section>

      <section className="mx-auto w-[min(920px,100%)] px-6 py-16 md:py-12">
        <h2 className="m-0 mb-4 font-[var(--font-display)] text-[32px] font-normal text-[var(--color-ink)] md:text-[26px]">
          Our flagship: {storeInfo.flagshipName}
        </h2>
        <p className="m-0 max-w-[42rem] text-[16px] leading-7 text-[var(--color-muted)]">
          {storeInfo.about}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {storeInfo.categories.map((category) => (
            <span
              key={category}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] tracking-[0.04em] text-[var(--color-brand)]"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid w-[min(920px,100%)] gap-10 px-6 py-14 md:grid-cols-1 lg:grid-cols-2">
          <div>
            <h2 className="m-0 mb-3 font-[var(--font-display)] text-[28px] font-normal text-[var(--color-ink)]">
              From customers
            </h2>
            <blockquote className="m-0 border-l border-[var(--color-brand)] pl-5">
              <p className="m-0 font-[var(--font-display)] text-[22px] leading-8 text-[var(--color-ink)]">
                &ldquo;{storeInfo.review.text}&rdquo;
              </p>
              <footer className="mt-3 text-[13px] tracking-[0.04em] text-[var(--color-muted)]">
                {storeInfo.review.author} · {storeInfo.review.source} ·{" "}
                {storeInfo.review.rating}/5
              </footer>
            </blockquote>
          </div>
          <div>
            <h2 className="m-0 mb-3 font-[var(--font-display)] text-[28px] font-normal text-[var(--color-ink)]">
              Visit Port Harcourt
            </h2>
            <p className="m-0 mb-2 text-[15px] leading-7 text-[var(--color-muted)]">
              {storeInfo.address}
            </p>
            <p className="m-0 mb-6 text-[15px] text-[var(--color-muted)]">
              {storeInfo.hours} · {storeInfo.phoneDisplay}
            </p>
            <Link
              href="/contact"
              className="brand-fill inline-flex px-5 py-2.5 text-[13px] font-semibold tracking-[0.08em] uppercase no-underline"
            >
              Contact &amp; directions
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
