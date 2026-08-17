// File: src/api/shareApi.ts

import axiosClient from "./axiosClient";
import type { FileRecordResponse } from "../types/file";
import type {
  CreateFileShareRequest,
  CreateTextShareRequest,
  ShareLinkResponse,
  ShareMetaResponse,
  ShareAccessResponse,
  AccessShareRequest,
} from "../types/share";

export const uploadFile = async (file: File): Promise<FileRecordResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<FileRecordResponse>(
    "/api/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const createFileShare = async (
  fileRecordId: string,
  data: CreateFileShareRequest,
): Promise<ShareLinkResponse> => {
  const response = await axiosClient.post<ShareLinkResponse>(
    `/api/shares/file/${fileRecordId}`,
    data,
  );
  return response.data;
};

export const createTextShare = async (
  data: CreateTextShareRequest,
): Promise<ShareLinkResponse> => {
  const response = await axiosClient.post<ShareLinkResponse>(
    "/api/shares/text",
    data,
  );
  return response.data;
};

export const getShareMeta = async (
  token: string,
): Promise<ShareMetaResponse> => {
  const response = await axiosClient.get<ShareMetaResponse>(
    `/api/shares/${token}`,
  );
  return response.data;
};

export const accessShare = async (
  token: string,
  data: AccessShareRequest,
): Promise<ShareAccessResponse> => {
  const response = await axiosClient.post<ShareAccessResponse>(
    `/api/shares/${token}/access`,
    data,
  );
  return response.data;
};

export const revokeShare = async (id: string): Promise<void> => {
  await axiosClient.patch(`/api/dashboard/shares/${id}/revoke`);
};
