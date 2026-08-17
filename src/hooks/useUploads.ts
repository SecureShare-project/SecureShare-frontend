import { useState, useCallback } from "react";
import { uploadFile } from "../api/shareApi";
import type { FileRecordResponse } from "../types/file";

export const useUploads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<FileRecordResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await uploadFile(file);
      } catch {
        setError("Failed to upload file.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    upload,
  };
};
