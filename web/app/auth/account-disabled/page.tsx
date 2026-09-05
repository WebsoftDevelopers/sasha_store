import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function AccountDisabledPage() {
  return (
    <AuthLayout title="Account disabled">
      <p className="m-0 text-[14px] text-[var(--color-muted)]">
        This account has been disabled. Contact support if you need help.
      </p>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Back to login
      </Link>
    </AuthLayout>
  );
}
