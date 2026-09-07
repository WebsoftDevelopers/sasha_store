"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

export function AosProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      delay: 40,
      anchorPlacement: "top-bottom",
      debounceDelay: 40,
      throttleDelay: 80,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => AOS.refreshHard(), 80);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return children;
}
