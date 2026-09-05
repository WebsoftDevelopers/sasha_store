"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function MotionSection(props: HTMLMotionProps<"section">) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}

export function MotionDiv(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}
