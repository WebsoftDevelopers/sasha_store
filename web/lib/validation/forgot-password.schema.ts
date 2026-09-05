// Type for forgot password form data
export type ForgotPasswordFormData = {
  email: string;
};

// Type for forgot password form errors
export type ForgotPasswordFormErrors = Partial<Record<keyof ForgotPasswordFormData, string>>;

// Validate forgot password form data
export function validateForgotPasswordForm(data: ForgotPasswordFormData): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
}
