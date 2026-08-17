import axiosClient from "./axiosClient";
import type { FileRecordResponse } from "../types/file";

export const globalSearch = async (
  search: string = "",
  uploader: string = "",
): Promise<FileRecordResponse[]> => {
  const response = await axiosClient.get<FileRecordResponse[]>("/api/files", {
    params: { search, uploader },
  });
  return response.data;
};

export const replaceFile = async (
  id: string,
  file: File,
): Promise<FileRecordResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post<FileRecordResponse>(
    `/api/files/${id}/replace`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
