"use client";

import { ReactNode } from "react";
import { SashaLogo } from "@/components/brand/sasha-logo";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--color-cream)] p-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 40% at 50% 0%, rgba(201,162,39,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 80% 100%, rgba(201,162,39,0.06) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative w-[min(440px,100%)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--glow-gold)] md:p-6">
        <div className="mb-8 flex flex-col items-start gap-4">
          <SashaLogo size={48} wordmarkClassName="brand-text text-[22px]" />
          {title ? (
            <div>
              <h1
                id="auth-heading"
                className="m-0 font-[var(--font-display)] text-[28px] font-normal text-[var(--color-ink)]"
              >
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 mb-0 text-[14px] text-[var(--color-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}
