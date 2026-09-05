"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export default function SessionsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
      setProvider((user?.app_metadata?.provider as string) || "email");
    }
    load();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">Sessions</h2>
      <p className="m-0 mb-6 text-[14px] text-[var(--color-muted)]">
        Current browser session for {email || "…"}. Auth provider: {provider}.
      </p>
      <div className="border border-[var(--color-border)] p-4">
        <p className="m-0 text-[14px]">This device</p>
        <p className="mt-1 mb-0 text-[13px] text-[var(--color-muted)]">Active now</p>
        <button type="button" onClick={signOut} className="auth-button mt-4 max-w-[200px]">
          Sign out
        </button>
      </div>
    </>
  );
}
