import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className = "",
  id,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
