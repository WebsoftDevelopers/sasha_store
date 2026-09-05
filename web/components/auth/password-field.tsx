"use client";

import { useState } from "react";

export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label ? (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="auth-input pr-14"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent text-[13px] text-[var(--color-muted)]"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
