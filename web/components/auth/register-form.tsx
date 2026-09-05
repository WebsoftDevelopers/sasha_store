"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "./password-field";
import { SocialAuthButtons } from "./social-auth-buttons";
import {
  RegisterFormData,
  RegisterFormErrors,
  validateRegisterForm,
} from "@/lib/validation/register.schema";
import { createClient } from "@/lib/supabase/browser-client";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    setSubmitError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          phone: formData.phone.trim() || undefined,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    if (data.session) {
      router.push("/account");
      router.refresh();
      return;
    }

    router.push(
      `/auth/check-email?email=${encodeURIComponent(formData.email.trim())}`,
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" className="auth-label">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        aria-invalid={Boolean(errors.email)}
        className="auth-input"
      />
      {errors.email ? <p className="auth-error">{errors.email}</p> : null}

      <PasswordField
        id="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={(value) => {
          setFormData((current) => ({ ...current, password: value }));
          if (errors.password) {
            setErrors((current) => ({ ...current, password: undefined }));
          }
        }}
        disabled={isLoading}
      />
      {errors.password ? <p className="auth-error">{errors.password}</p> : null}

      <label htmlFor="phone" className="auth-label">
        Phone number <span className="font-normal text-[var(--color-muted)]">(optional)</span>
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        value={formData.phone}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="+1 555 000 0000"
        aria-invalid={Boolean(errors.phone)}
        className="auth-input"
      />
      {errors.phone ? <p className="auth-error">{errors.phone}</p> : null}

      {submitError ? (
        <p className="auth-error text-center">{submitError}</p>
      ) : null}

      <button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-4 text-center text-[13px]">
        Already have an account?{" "}
        <Link href="/auth/login" className="auth-link">
          Sign in
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3 text-[12px] text-[var(--color-muted)] before:h-px before:flex-1 before:bg-[var(--color-border)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--color-border)] after:content-['']">
        <span>or continue with</span>
      </div>

      <SocialAuthButtons />
    </form>
  );
}
