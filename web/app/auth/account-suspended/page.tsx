import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function AccountSuspendedPage() {
  return (
    <AuthLayout title="Account suspended">
      <p className="m-0 text-[14px] text-[var(--color-muted)]">
        This account is temporarily suspended. Contact support for details.
      </p>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Back to login
      </Link>
    </AuthLayout>
  );
}
