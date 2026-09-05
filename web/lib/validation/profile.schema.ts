// Type for editable profile data
export type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

// Type for profile validation errors
export type ProfileFormErrors = Partial<Record<keyof ProfileFormData, string>>;

// Validate profile form data for the UI flow
export function validateProfileForm(
  data: ProfileFormData
): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[+\d\s\-()]+$/.test(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  return errors;
}
