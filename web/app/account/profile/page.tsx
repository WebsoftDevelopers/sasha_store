"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { authApi, type AppUser } from "@/lib/api/auth-api";

export default function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError("Not signed in");
          return;
        }
        const me = await authApi.me(session.access_token);
        if (!cancelled) {
          setUser(me);
          setFullName(me.fullName || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      const updated = await authApi.updateProfile(session.access_token, {
        fullName,
      });
      setUser(updated);
      setMessage("Profile updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-[var(--color-muted)]">Loading profile...</p>;
  }

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">Profile</h2>
      <p className="m-0 mb-6 text-[14px] text-[var(--color-muted)]">
        Changes are saved to the Nest API `users` table (portable mirror of Supabase Auth).
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          id="email"
          value={user?.email || ""}
          disabled
          className="auth-input opacity-70"
        />

        <label htmlFor="fullName" className="auth-label">
          Full name
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={saving}
          className="auth-input"
        />

        {message ? (
          <p className="mt-3 text-[14px] text-[var(--color-success)]">{message}</p>
        ) : null}
        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" disabled={saving} className="auth-button max-w-[220px]">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </>
  );
}
