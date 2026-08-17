export interface AccessLogResponse {
  shareToken: string;
  itemType: "FILE" | "TEXT";
  itemName: string;
  ownerUsername: string;
  accessedAt: string;
}
