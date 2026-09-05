"use client";

import { FormEvent, useState } from "react";
import { PasswordField } from "@/components/auth/password-field";
import { PasswordStrength } from "@/components/auth/password-strength";
import { createClient } from "@/lib/supabase/browser-client";

export default function SecurityPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Password updated");
  };

  return (
    <>
      <h2 className="m-0 mb-2 font-[var(--font-display)] text-[28px]">Security</h2>
      <p className="m-0 mb-6 text-[14px] text-[var(--color-muted)]">
        Update your password. Google-only accounts may not use password login.
      </p>
      <form onSubmit={handleSubmit} className="max-w-[420px]">
        <PasswordField
          id="password"
          name="password"
          label="New password"
          value={password}
          onChange={setPassword}
          disabled={saving}
        />
        <PasswordStrength password={password} />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={saving}
        />
        {message ? (
          <p className="mt-3 text-[14px] text-[var(--color-success)]">{message}</p>
        ) : null}
        {error ? <p className="auth-error">{error}</p> : null}
        <button type="submit" disabled={saving} className="auth-button">
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </>
  );
}
