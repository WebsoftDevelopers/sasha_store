"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      setReady(true);
    }
    check();
  }, [router]);

  if (!ready) {
    return <p className="p-6 text-[var(--color-muted)]">Checking session...</p>;
  }

  return <>{children}</>;
}
