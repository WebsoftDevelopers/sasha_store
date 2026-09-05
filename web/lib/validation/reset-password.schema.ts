// Type for reset password form data
export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

// Type for reset password form errors
export type ResetPasswordFormErrors = Partial<
  Record<keyof ResetPasswordFormData, string>
>;

// Validate reset password form data for the UI flow
export function validateResetPasswordForm(
  data: ResetPasswordFormData
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};

  if (!data.password) {
    errors.password = "Password is required";
  } else {
    if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(data.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(data.password)) {
      errors.password =
        "Password must contain at least one special character";
    }
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
