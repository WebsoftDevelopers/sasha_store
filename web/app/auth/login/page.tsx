import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<p className="text-[var(--color-muted)]">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
