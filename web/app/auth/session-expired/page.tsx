import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SessionExpiredPage() {
  return (
    <AuthLayout title="Session expired">
      <p className="m-0 text-[14px] text-[var(--color-muted)]">
        Your session ended. Sign in again to continue.
      </p>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Sign in
      </Link>
    </AuthLayout>
  );
}
