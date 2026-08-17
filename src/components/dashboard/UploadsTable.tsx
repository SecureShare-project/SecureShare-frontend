// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/components/dashboard/UploadsTable.tsx

import React, { useEffect, useState } from "react";
import { getUploads } from "../../api/dashboardApi";
import type { MyUploadResponse } from "../../types/file";

const MOCK_UPLOADS: MyUploadResponse[] = [
  {
    id: "1",
    originalFileName: "government_id.pdf",
    fileSize: 1258291,
    contentType: "application/pdf",
    uploadedAt: "2025-01-15T10:30:00.000Z",
    replaced: false,
  },
  {
    id: "2",
    originalFileName: "rental_agreement.pdf",
    fileSize: 2516582,
    contentType: "application/pdf",
    uploadedAt: "2025-01-18T14:20:00.000Z",
    replaced: true,
  },
];

export const UploadsTable: React.FC = () => {
  const [uploads, setUploads] = useState<MyUploadResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    getUploads()
      .then((data) => {
        if (isMounted) {
          setUploads(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch uploads, showing mock data", err);
        if (isMounted) {
          setUploads(MOCK_UPLOADS);
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

  const formatSizeBytes = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full bg-[#1E2233] border border-[#4A5568] rounded-xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-[#4A5568] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#E2E8F0]">Recent Uploads</h2>
        <span className="text-xs text-gray-400">
          Total Documents: {uploads.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#E2E8F0]">
          <thead className="bg-[#181B28] text-xs text-gray-400 uppercase tracking-wider border-b border-[#4A5568]">
            <tr>
              <th scope="col" className="px-6 py-3">
                File Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Size
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
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#D9A066] border-t-transparent rounded-full animate-spin" />
                    <span>Loading uploads...</span>
                  </div>
                </td>
              </tr>
            : uploads.length === 0 ?
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No uploads yet
                </td>
              </tr>
            : uploads.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#252A3E] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {item.originalFileName}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(item.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatSizeBytes(item.fileSize)}
                  </td>
                  <td className="px-6 py-4">
                    {item.replaced && (
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                        Superseded
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                      Replace
                    </button>
                    <button
                      type="button"
                      className="text-[#D9A066] hover:text-[#e0ad79] transition-colors text-xs font-medium">
                      View Details
                    </button>
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

export default UploadsTable;
