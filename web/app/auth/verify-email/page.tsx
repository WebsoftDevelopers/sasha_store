import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Verify email" subtitle="Open the link we sent to confirm your account.">
      <p className="m-0 text-[14px] text-[var(--color-muted)]">
        After verifying, you can sign in and access your account.
      </p>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Go to login
      </Link>
      <Link
        href="/auth/resend-verification"
        className="auth-link mt-4 block text-center text-[14px]"
      >
        Resend verification email
      </Link>
    </AuthLayout>
  );
}
