"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/account");
        return;
      }
      setReady(true);
    }
    check();
  }, [router]);

  if (!ready) {
    return <p className="p-6 text-[var(--color-muted)]">Loading...</p>;
  }

  return <>{children}</>;
}
