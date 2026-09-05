"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordField } from "./password-field";
import { SocialAuthButtons } from "./social-auth-buttons";
import {
  LoginFormData,
  LoginFormErrors,
  validateLoginForm,
} from "@/lib/validation/login.schema";
import { createClient } from "@/lib/supabase/browser-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setSubmitError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    const next = searchParams.get("next") || "/account";
    router.push(next);
    router.refresh();
  };

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
        placeholder="you@example.com"
        disabled={isLoading}
        aria-invalid={Boolean(errors.email)}
        className="auth-input"
      />
      {errors.email ? <p className="auth-error">{errors.email}</p> : null}

      <div className="flex items-end justify-between">
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <Link
          href="/auth/forgot-password"
          className="auth-link mb-2 text-[12px]"
        >
          Forgot password?
        </Link>
      </div>
      <PasswordField
        id="password"
        name="password"
        label=""
        value={formData.password}
        onChange={(value) =>
          setFormData((current) => ({ ...current, password: value }))
        }
        placeholder="Enter your password"
        disabled={isLoading}
      />
      {errors.password ? <p className="auth-error">{errors.password}</p> : null}
      {submitError ? <p className="auth-error text-center">{submitError}</p> : null}

      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Signing in..." : "Login"}
      </button>

      <p className="mt-4 text-center text-[13px]">
        Do not have an account?{" "}
        <Link href="/auth/register" className="auth-link">
          Create one
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3 text-[12px] text-[var(--color-muted)] before:h-px before:flex-1 before:bg-[var(--color-border)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--color-border)] after:content-['']">
        <span>or continue with</span>
      </div>

      <SocialAuthButtons />
    </form>
  );
}
