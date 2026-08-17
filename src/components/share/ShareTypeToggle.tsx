// src/components/share/ShareTypeToggle.tsx
import React from "react";

interface ShareTypeToggleProps {
  type: "FILE" | "TEXT";
  onChange: (type: "FILE" | "TEXT") => void;
}

export const ShareTypeToggle: React.FC<ShareTypeToggleProps> = ({
  type,
  onChange,
}) => {
  return (
    <div className="flex bg-[#1E2233] p-1 rounded border border-[#4A5568] mb-4">
      <button
        type="button"
        onClick={() => onChange("FILE")}
        className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
          type === "FILE" ?
            "bg-[#4A5568] text-[#E2E8F0]"
          : "text-gray-400 hover:text-[#E2E8F0]"
        }`}>
        Upload File
      </button>
      <button
        type="button"
        onClick={() => onChange("TEXT")}
        className={`flex-1 py-1.5 text-sm font-medium rounded transition-colors ${
          type === "TEXT" ?
            "bg-[#4A5568] text-[#E2E8F0]"
          : "text-gray-400 hover:text-[#E2E8F0]"
        }`}>
        Share Text
      </button>
    </div>
  );
};
