import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold shadow-lg",
  secondary: "bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-medium",
  danger: "bg-rose-600 hover:bg-rose-700 text-white font-bold",
  ghost:
    "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2 ${variantStyles[variant]} ${className}`}
      {...rest}>
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
