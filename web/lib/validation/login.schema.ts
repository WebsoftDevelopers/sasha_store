// Type for login form data
export type LoginFormData = {
  email: string;
  password: string;
};

// Type for login form errors
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// Validate login form data for the UI flow
export function validateLoginForm(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}
