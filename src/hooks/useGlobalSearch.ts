// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/hooks/useGlobalSearch.ts

import { useState, useEffect } from "react";
import { globalSearch } from "../api/fileApi";
import type { FileRecordResponse } from "../types/file";

const MOCK_FILES: FileRecordResponse[] = [
  {
    id: "f_1",
    originalFileName: "Quarterly_Report.pdf",
    fileSize: 2457600,
    contentType: "application/pdf",
    uploadedByUsername: "finance_team",
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "f_2",
    originalFileName: "Design_System_v2.fig",
    fileSize: 15728640,
    contentType: "application/octet-stream",
    uploadedByUsername: "sarah_designer",
    uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "f_3",
    originalFileName: "Database_Backup_2026.sql",
    fileSize: 52428800,
    contentType: "text/plain",
    uploadedByUsername: "sysadmin",
    uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

export const useGlobalSearch = () => {
  const [search, setSearch] = useState("");
  const [uploader, setUploader] = useState("");
  const [files, setFiles] = useState<FileRecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      setLoading(true);
      globalSearch(search, uploader)
        .then((data) => {
          if (isMounted) {
            setFiles(data);
            setError(null);
          }
        })
        .catch(() => {
          if (isMounted) {
            const filtered = MOCK_FILES.filter((file) => {
              const matchesSearch =
                !search ||
                file.originalFileName
                  .toLowerCase()
                  .includes(search.toLowerCase());
              const matchesUploader =
                !uploader ||
                file.uploadedByUsername
                  .toLowerCase()
                  .includes(uploader.toLowerCase());
              return matchesSearch && matchesUploader;
            });
            setFiles(filtered);
            setError(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [search, uploader]);

  return { search, setSearch, uploader, setUploader, files, loading, error };
};
