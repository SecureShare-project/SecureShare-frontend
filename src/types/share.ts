// File: src/types/share.ts

export type AccessType = "AUTHENTICATED_USER" | "PASSWORD";
export type ShareType = "FILE" | "TEXT";
export type ShareStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

// Step 1 of file sharing: the file itself is uploaded separately via the file-upload endpoint,
// which returns a FileRecordResponse with an `id`. This id is then used below.
export interface CreateFileShareRequest {
  accessType: AccessType;
  password?: string;
  expiryMinutes: number;
}

export interface CreateTextShareRequest {
  textContent: string;
  accessType: AccessType;
  password?: string;
  expiryMinutes: number;
}

// Response shape returned by both share-creation endpoints
export interface ShareLinkResponse {
  id: string;
  token: string;
  type: ShareType;
  accessType: AccessType;
  expiresAt: string;
  createdAt: string;
}

export interface MyShareResponse {
  id: string;
  token: string;
  type: ShareType;
  itemName: string;
  status: ShareStatus;
  expiresAt: string;
  createdAt: string;
}

export interface ShareMetaResponse {
  token: string;
  type: ShareType;
  accessType: AccessType;
  itemName: string;
  sizeBytes?: number;
  expired: boolean;
}

export interface ShareAccessResponse {
  id: string;
  name: string;
  type: ShareType;
  sizeBytes?: number;
  textPreview?: string;
  accessType: AccessType;
  textContent?: string;
  downloadUrl?: string;
}

export interface AccessShareRequest {
  password?: string;
}
