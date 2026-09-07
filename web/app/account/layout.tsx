import { ReactNode } from "react";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-cream)] px-[18px] py-8">
      <div className="mx-auto grid w-[min(1120px,100%)] grid-cols-[260px_1fr] items-start gap-6 lg:grid-cols-1">
        <AccountSidebar />
        <section className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:px-[22px]">
          {children}
        </section>
      </div>
    </main>
  );
}
