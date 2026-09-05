import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send a link to reset your Shasha Fragrance password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
