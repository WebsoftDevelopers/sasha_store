"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser-client";

export function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setSubmitError("Email is required");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="py-6 text-center">
        <h2 className="mb-3 text-[var(--color-success)]">Email sent</h2>
        <p className="text-[var(--color-muted)]">
          Check your inbox for a new verification link.
        </p>
        <Link href="/auth/login" className="auth-button mt-5 inline-flex">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" className="auth-label">
        Email address
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="auth-input"
      />
      {submitError ? <p className="auth-error">{submitError}</p> : null}
      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Sending..." : "Resend verification"}
      </button>
    </form>
  );
}
