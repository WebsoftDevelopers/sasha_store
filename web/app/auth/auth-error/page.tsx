import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

function StatusPage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AuthLayout title={title}>
      <p className="m-0 text-[14px] text-[var(--color-muted)]">{message}</p>
      <Link href="/auth/login" className="auth-button mt-6 inline-flex">
        Back to login
      </Link>
    </AuthLayout>
  );
}

export default function AuthErrorPage() {
  return (
    <StatusPage
      title="Authentication error"
      message="Something went wrong during sign-in. Please try again."
    />
  );
}
