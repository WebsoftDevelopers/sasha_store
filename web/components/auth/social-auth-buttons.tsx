"use client";

import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/browser-client";
import { useState } from "react";

export function SocialAuthButtons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        aria-label="Continue with Google"
        className="auth-button-secondary auth-button mt-0 inline-flex gap-2"
      >
        <FaGoogle aria-hidden />
        {loading ? "Connecting..." : "Continue with Google"}
      </button>
      {error ? <p className="auth-error text-center">{error}</p> : null}
    </div>
  );
}
