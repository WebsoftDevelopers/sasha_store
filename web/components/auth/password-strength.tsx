"use client";

export function PasswordStrength({ password }: { password: string }) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const requirementsMet = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strength = "Too weak";
  let color = "var(--color-error)";
  if (requirementsMet === 5) {
    strength = "Strong";
    color = "var(--color-success)";
  } else if (requirementsMet >= 3) {
    strength = "Medium";
    color = "var(--color-brand)";
  } else if (requirementsMet >= 1) {
    strength = "Weak";
    color = "var(--color-brand-deep)";
  }

  return (
    <div className="mt-2 border-t border-[var(--color-border)] pt-2.5 text-[12px]">
      <b className="block" style={{ color }}>
        Password quality: {strength}
      </b>
      <span className="mt-2 block leading-[1.4] text-[var(--color-muted)]">
        {[
          { label: "At least 8 characters", met: hasMinLength },
          { label: "One uppercase letter", met: hasUppercase },
          { label: "One lowercase letter", met: hasLowercase },
          { label: "One number", met: hasNumber },
          { label: "One special character", met: hasSpecial },
        ].map((req) => (
          <div
            key={req.label}
            className="mt-1 text-[12px]"
            style={{
              color: req.met ? "var(--color-success)" : "var(--color-muted)",
            }}
          >
            {req.met ? "✓" : "○"} {req.label}
          </div>
        ))}
      </span>
    </div>
  );
}
