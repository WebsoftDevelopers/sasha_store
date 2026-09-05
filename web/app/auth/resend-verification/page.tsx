import { AuthLayout } from "@/components/auth/auth-layout";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export default function ResendVerificationPage() {
  return (
    <AuthLayout title="Resend verification" subtitle="Get a new confirmation link.">
      <ResendVerificationForm />
    </AuthLayout>
  );
}
