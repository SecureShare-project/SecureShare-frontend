// src/types/file.ts
export interface MyUploadResponse {
  id: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  replaced?: boolean;
}

export interface FileRecordResponse {
  id: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadedByUsername: string;
  uploadedAt: string;
}
