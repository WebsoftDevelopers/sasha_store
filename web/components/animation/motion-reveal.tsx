"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function MotionSection(props: HTMLMotionProps<"section">) {
  const { className, ...motionProps } = props;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.985, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.76, ease }}
      className={["motion-section", className].filter(Boolean).join(" ")}
      {...motionProps}
    />
  );
}

export function MotionDiv(props: HTMLMotionProps<"div">) {
  const { className, ...motionProps } = props;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.99, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.68, ease }}
      className={className}
      {...motionProps}
    />
  );
}
