"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser-client";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirm !== "DELETE") {
      setMessage('Type DELETE to confirm, then contact support for full deletion.');
      return;
    }
    // Full auth.users deletion requires service role; for now sign out and guide the user.
    setMessage(
      "Account deletion from the storefront signs you out. Ask an admin to remove your row from auth and public.users for a full wipe.",
    );
    const supabase = createClient();
    await supabase.auth.signOut();
    setTimeout(() => {
      router.push("/auth/login");
      router.refresh();
    }, 2000);
  };

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">
        Delete account
      </h2>
      <p className="m-0 mb-6 text-[14px] text-[var(--color-muted)]">
        This removes your local session. Permanent deletion is handled by support
        so orders and backups stay consistent.
      </p>
      <label htmlFor="confirm" className="auth-label">
        Type DELETE to continue
      </label>
      <input
        id="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="auth-input max-w-[320px]"
      />
      {message ? <p className="mt-3 text-[14px] text-[var(--color-muted)]">{message}</p> : null}
      <button
        type="button"
        onClick={handleDelete}
        className="auth-button mt-4 max-w-[240px] border-[var(--color-error)] bg-[var(--color-error)]"
      >
        Delete and sign out
      </button>
    </>
  );
}
