import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
