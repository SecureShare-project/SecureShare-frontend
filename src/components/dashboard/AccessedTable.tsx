import React from "react";
import { useAccessedItems } from "../../hooks/useAccessedItems";

export const AccessedTable: React.FC = () => {
  const { items, search, setSearch, loading, error } = useAccessedItems();

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-full bg-[#1E2233] border border-[#4A5568] rounded-xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-[#4A5568] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#E2E8F0]">
            Accessed Items Log
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Activity history of shared items accessed by third parties
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item name..."
            className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#E2E8F0]">
          <thead className="bg-[#181B28] text-xs text-gray-400 uppercase tracking-wider border-b border-[#4A5568]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Item Name
              </th>
              <th scope="col" className="px-6 py-3">
                Accessed At
              </th>
              <th scope="col" className="px-6 py-3">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4A5568]/50">
            {loading ?
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#D9A066] border-t-transparent rounded-full animate-spin" />
                    <span>Loading accessed items...</span>
                  </div>
                </td>
              </tr>
            : error ?
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            : items.length === 0 ?
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                  No accessed items yet
                </td>
              </tr>
            : items.map((item) => (
                <tr
                  key={item.shareToken}
                  className="hover:bg-[#252A3E] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <span>{item.itemType === "FILE" ? "📁" : "📝"}</span>
                    <span>{item.itemName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(item.accessedAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                    @{item.ownerUsername}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessedTable;
