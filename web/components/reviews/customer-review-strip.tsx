"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Amaka N.",
    location: "Port Harcourt",
    rating: 5,
    initials: "AN",
    text: "The perfume lasted all day and the seller responded quickly.",
  },
  {
    name: "Tomi A.",
    location: "Lagos",
    rating: 5,
    initials: "TA",
    text: "Checkout was smooth, and I could see the shop details before ordering.",
  },
  {
    name: "Chidinma O.",
    location: "Abuja",
    rating: 4,
    initials: "CO",
    text: "Loved the fragrance selection. The product page felt clear and premium.",
  },
  {
    name: "Favour E.",
    location: "Owerri",
    rating: 5,
    initials: "FE",
    text: "The scent was exactly what I wanted. I like that reviews are tied to buyers.",
  },
  {
    name: "Zainab K.",
    location: "Kano",
    rating: 5,
    initials: "ZK",
    text: "Beautiful store feel, easy search, and the cart worked without forcing login.",
  },
];

export function CustomerReviewStrip() {
  return (
    <section className="overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto w-[min(1180px,100%)] px-6 py-20 md:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="m-0 text-[11px] tracking-[0.22em] text-[var(--color-brand-deep)] uppercase">
              From customers
            </p>
            <h2 className="mt-3 mb-0 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-normal text-[var(--color-ink)]">
              Loved by fragrance buyers
            </h2>
          </div>
          <p className="m-0 max-w-[28rem] text-[14px] leading-6 text-[var(--color-muted)]">
            Real marketplace feedback, built around verified purchase reviews and
            simple seller communication.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="group relative min-h-[260px] overflow-hidden border border-[rgba(201,162,39,0.24)] bg-[rgba(248,243,234,0.54)] p-5 shadow-[0_18px_42px_rgba(84,55,25,0.08)] backdrop-blur-sm"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--gradient-brand)] opacity-80" />
              <div className="mb-5 flex items-center gap-3">
                <div className="brand-fill relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-bold">
                  <span className="absolute inset-1 rounded-full bg-[rgba(255,255,255,0.26)]" />
                  <span className="relative">{review.initials}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="m-0 truncate text-[14px] font-semibold text-[var(--color-ink)]">
                    {review.name}
                  </h3>
                  <p className="m-0 mt-0.5 text-[12px] text-[var(--color-muted)]">
                    {review.location}
                  </p>
                </div>
              </div>

              <p className="m-0 mb-4 text-[13px] tracking-[0.08em] text-[var(--color-brand-deep)]">
                {"★".repeat(review.rating)}
                <span className="text-[rgba(138,112,24,0.22)]">
                  {"★".repeat(5 - review.rating)}
                </span>
              </p>
              <p className="m-0 text-[14px] leading-7 text-[var(--color-muted)]">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="absolute right-4 bottom-4 text-[42px] leading-none text-[rgba(201,162,39,0.16)] transition-transform duration-300 group-hover:scale-110">
                ”
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
