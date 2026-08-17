// src/components/ui/StatusBadge.tsx
import React from "react";

interface StatusBadgeProps {
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    ACTIVE: "bg-emerald-950/60 text-emerald-400 border-emerald-800",
    EXPIRED: "bg-gray-800 text-gray-400 border-gray-600",
    REVOKED: "bg-rose-950/60 text-rose-400 border-rose-800",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs rounded border font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};
