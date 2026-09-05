export type RegisterFormData = {
  email: string;
  phone: string;
  password: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

export function validateRegisterForm(data: RegisterFormData): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (data.phone.trim()) {
    const phoneRegex = /^[+\d\s\-()]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  return errors;
}
