import { useState, useCallback } from "react";
import {
  createFileShare,
  createTextShare,
  getShareMeta,
  accessShare,
  revokeShare,
} from "../api/shareApi";
import type {
  CreateFileShareRequest,
  CreateTextShareRequest,
  ShareLinkResponse,
  ShareMetaResponse,
  ShareAccessResponse,
  AccessShareRequest,
} from "../types/share";

export const useShares = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareFile = useCallback(
    async (
      fileRecordId: string,
      data: CreateFileShareRequest,
    ): Promise<ShareLinkResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await createFileShare(fileRecordId, data);
      } catch {
        setError("Failed to create file share.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const shareText = useCallback(
    async (data: CreateTextShareRequest): Promise<ShareLinkResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await createTextShare(data);
      } catch {
        setError("Failed to create text share.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchShareMeta = useCallback(
    async (token: string): Promise<ShareMetaResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getShareMeta(token);
      } catch {
        setError("Failed to load share.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const openShare = useCallback(
    async (
      token: string,
      data: AccessShareRequest,
    ): Promise<ShareAccessResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await accessShare(token, data);
      } catch {
        setError("Failed to access share.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const revoke = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await revokeShare(id);
      return true;
    } catch {
      setError("Failed to revoke share.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    shareFile,
    shareText,
    fetchShareMeta,
    openShare,
    revoke,
  };
};
