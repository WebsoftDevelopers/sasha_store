"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
  validateForgotPasswordForm,
} from "@/lib/validation/forgot-password.schema";
import { createClient } from "@/lib/supabase/browser-client";

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ForgotPasswordFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForgotPasswordForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
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
        <h2 className="mb-3 text-[var(--color-success)]">Check your email</h2>
        <p className="text-[var(--color-muted)]">
          If an account exists for that address, we sent a reset link.
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
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        aria-invalid={Boolean(errors.email)}
        className="auth-input"
      />
      {errors.email ? <p className="auth-error">{errors.email}</p> : null}
      {submitError ? <p className="auth-error text-center">{submitError}</p> : null}
      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Sending..." : "Send reset link"}
      </button>
      <p className="mt-4 text-center text-[13px]">
        <Link href="/auth/login" className="auth-link">
          Back to login
        </Link>
      </p>
    </form>
  );
}
