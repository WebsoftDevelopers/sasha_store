import { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import { SiteFooter } from "@/components/site/site-footer";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-cream)]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
