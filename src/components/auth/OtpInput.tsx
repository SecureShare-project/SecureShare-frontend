// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/components/auth/OtpInput.tsx

import React, { useRef } from "react";

interface OtpInputProps {
  onChange: (otp: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ onChange }) => {
  const length = 6;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = React.useState<string[]>(Array(length).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const rawValue = e.target.value;
    const digitOnly = rawValue.replace(/\D/g, "");

    if (!digitOnly && rawValue !== "") return;

    const char = digitOnly.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    onChange(newDigits.join(""));

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pastedData) return;

    const newDigits = Array(length).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);
    onChange(newDigits.join(""));

    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center items-center w-full">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-xl font-bold bg-[#1E2233] border border-[#4A5568] rounded-md text-[#E2E8F0] focus:outline-none focus:border-[#D9A066] transition-colors"
        />
      ))}
    </div>
  );
};

export default OtpInput;
