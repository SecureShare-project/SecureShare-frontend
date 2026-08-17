import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  danger = false,
}) => {
  return (
    <div
      className={`bg-[#1E2233] border ${
        danger ? "border-rose-900/40" : "border-[#4A5568]"
      } rounded-2xl p-6 shadow-xl space-y-4 ${className}`}>
      {title && (
        <h2
          className={`text-lg font-bold border-b border-[#4A5568]/50 pb-3 ${
            danger ? "text-rose-400" : "text-white"
          }`}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
