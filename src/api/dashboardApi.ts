import axiosClient from "./axiosClient";
import type { MyUploadResponse } from "../types/file";
import type { MyShareResponse } from "../types/share";
import type { AccessLogResponse } from "../types/accessLog";

export const getUploads = async (): Promise<MyUploadResponse[]> => {
  const response = await axiosClient.get<MyUploadResponse[]>(
    "/api/dashboard/uploads",
  );
  return response.data;
};

export const getShares = async (): Promise<MyShareResponse[]> => {
  const response = await axiosClient.get<MyShareResponse[]>(
    "/api/dashboard/shares",
  );
  return response.data;
};

export const getAccessed = async (
  search: string = "",
): Promise<AccessLogResponse[]> => {
  const response = await axiosClient.get<AccessLogResponse[]>(
    "/api/dashboard/accessed",
    {
      params: { search },
    },
  );
  return response.data;
};
