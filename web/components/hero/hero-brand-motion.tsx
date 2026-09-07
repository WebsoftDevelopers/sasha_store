"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  locationLine: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
};

const letters = "Shasha".split("");

export function HeroBrandMotion({ locationLine }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative mx-auto flex w-[min(980px,100%)] flex-col items-center px-6 py-20 text-center md:py-24"
    >
      <motion.p
        variants={item}
        className="m-0 text-[11px] tracking-[0.28em] text-[var(--color-brand-light)] uppercase"
      >
        {locationLine}
      </motion.p>

      <motion.h1
        aria-label="Shasha"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.055,
            },
          },
        }}
        className="gold-text mt-6 mb-0 flex font-[var(--font-body)] text-[clamp(5rem,17vw,13rem)] leading-[0.82] font-bold tracking-[0.04em] uppercase"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: 42, rotateX: -72 },
              show: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: { duration: 0.64, ease },
              },
            }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        variants={item}
        className="gold-text mt-2 mb-0 overflow-hidden whitespace-nowrap border-r border-transparent pr-1 font-[var(--font-display)] text-[clamp(1.25rem,3.2vw,1.85rem)] font-normal tracking-[0.2em] uppercase"
        initial={{ width: 0, opacity: 1 }}
        animate={{ width: "auto", opacity: 1 }}
        transition={{ duration: 1.25, ease: "easeInOut", delay: 0.62 }}
      >
        Fragrance
      </motion.p>

      <motion.span
        variants={item}
        className="gold-rule mt-8"
      />

      <motion.p
        variants={item}
        className="mt-7 mb-0 max-w-[34rem] text-[17px] leading-8 text-white/82"
      >
        Long-lasting scents and beauty from Port Harcourt — browse freely, add
        to cart, and sign in only when you order.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        <Link
          href="/products"
          className="brand-fill inline-flex !border-transparent px-7 py-3.5 text-[13px] font-semibold tracking-[0.12em] uppercase no-underline active:scale-[0.98]"
        >
          Shop the collection
        </Link>
        <a
          href="#about"
          className="brand-outline inline-flex !border-transparent px-7 py-3.5 text-[13px] font-semibold tracking-[0.12em] uppercase no-underline"
        >
          Our story
        </a>
      </motion.div>
    </motion.div>
  );
}
