"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "./password-field";
import { PasswordStrength } from "./password-strength";
import {
  ResetPasswordFormData,
  ResetPasswordFormErrors,
  validateResetPasswordForm,
} from "@/lib/validation/reset-password.schema";
import { createClient } from "@/lib/supabase/browser-client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateResetPasswordForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => router.push("/auth/login"), 1500);
  };

  if (isSuccess) {
    return (
      <div className="py-6 text-center">
        <h2 className="mb-3 text-[var(--color-success)]">Password updated</h2>
        <p className="text-[var(--color-muted)]">You can sign in with your new password.</p>
        <Link href="/auth/login" className="auth-button mt-5 inline-flex">
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PasswordField
        id="password"
        name="password"
        label="New password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        disabled={isLoading}
      />
      <PasswordStrength password={formData.password} />
      {errors.password ? <p className="auth-error">{errors.password}</p> : null}

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        value={formData.confirmPassword}
        onChange={(value) => updateField("confirmPassword", value)}
        disabled={isLoading}
      />
      {errors.confirmPassword ? (
        <p className="auth-error">{errors.confirmPassword}</p>
      ) : null}
      {submitError ? <p className="auth-error text-center">{submitError}</p> : null}

      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
