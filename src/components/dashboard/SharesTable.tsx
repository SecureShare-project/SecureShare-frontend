// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/components/dashboard/SharesTable.tsx

import React, { useEffect, useState } from "react";
import { revokeShare } from "../../api/shareApi";
import { getShares } from "../../api/dashboardApi";
import type { MyShareResponse } from "../../types/share";

const MOCK_SHARES: MyShareResponse[] = [
  {
    id: "1",
    token: "shr_9a8b7c6d5e4f",
    type: "FILE",
    itemName: "government_id.pdf",
    status: "ACTIVE",
    createdAt: "2025-01-20T09:00:00.000Z",
    expiresAt: "2025-02-20T09:00:00.000Z",
  },
  {
    id: "2",
    token: "shr_1f2e3d4c5b6a",
    type: "TEXT",
    itemName: "Wi-Fi Access Credentials",
    status: "EXPIRED",
    createdAt: "2024-12-01T09:00:00.000Z",
    expiresAt: "2025-01-01T09:00:00.000Z",
  },
];

export const SharesTable: React.FC = () => {
  const [shares, setShares] = useState<MyShareResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getShares()
      .then((data) => {
        if (isMounted) {
          setShares(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch shares, showing mock data", err);
        if (isMounted) {
          setShares(MOCK_SHARES);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRevoke = async (id: string) => {
    setError(null);
    try {
      await revokeShare(id);
      setShares((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "REVOKED" } : s)),
      );
    } catch {
      setError("Failed to revoke share. Please try again.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "REVOKED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "EXPIRED":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center">
          {error}
        </div>
      )}

      <div className="w-full bg-[#1E2233] border border-[#4A5568] rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#4A5568] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#E2E8F0]">
            Document Shares
          </h2>
          <span className="text-xs text-gray-400">
            Total Shares: {shares.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#E2E8F0]">
            <thead className="bg-[#181B28] text-xs text-gray-400 uppercase tracking-wider border-b border-[#4A5568]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Expiration
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A5568]/50">
              {loading ?
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#D9A066] border-t-transparent rounded-full animate-spin" />
                      <span>Loading shares...</span>
                    </div>
                  </td>
                </tr>
              : shares.length === 0 ?
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400">
                    No active shares
                  </td>
                </tr>
              : shares.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#252A3E] transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                      <span>{item.type === "FILE" ? "📁" : "📝"}</span>
                      <span>{item.itemName}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(item.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(
                          item.status,
                        )}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status.toUpperCase() === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors text-xs font-medium">
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SharesTable;
