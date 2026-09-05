import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;

  return (
    <AuthLayout title="Check your email" subtitle="Confirm your address to finish signing up.">
      <p className="m-0 text-[14px] text-[var(--color-muted)]">
        {email
          ? `We sent a verification link to ${email}.`
          : "We sent a verification link to your email."}
      </p>
      <Link href="/auth/resend-verification" className="auth-link mt-4 inline-block text-[14px]">
        Resend verification email
      </Link>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Back to login
      </Link>
    </AuthLayout>
  );
}
