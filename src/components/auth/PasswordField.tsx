// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/components/auth/PasswordField.tsx

import React, { useState } from "react";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[#E2E8F0]">{label}</label>
      )}
      <div className="relative flex items-center w-full">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full px-3 py-2 pr-14 bg-[#1E2233] border border-[#4A5568] rounded-md text-[#E2E8F0] placeholder-gray-400 focus:outline-none focus:border-[#D9A066] transition-colors ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 text-xs font-semibold text-[#D9A066] hover:text-[#e0ad79] focus:outline-none select-none">
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default PasswordField;
