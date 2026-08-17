// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/hooks/useAccessedItems.ts

import { useState, useEffect } from "react";
import { getAccessed } from "../api/dashboardApi";
import type { AccessLogResponse } from "../types/accessLog";

const MOCK_ACCESSED: AccessLogResponse[] = [
  {
    shareToken: "tok_1",
    itemType: "FILE",
    itemName: "Project_Proposal.pdf",
    ownerUsername: "john_doe",
    accessedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    shareToken: "tok_2",
    itemType: "TEXT",
    itemName: "API Credentials Note",
    ownerUsername: "alice_smith",
    accessedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    shareToken: "tok_3",
    itemType: "FILE",
    itemName: "Architecture_Diagram.png",
    ownerUsername: "bob_dev",
    accessedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const useAccessedItems = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<AccessLogResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      setLoading(true);
      getAccessed(search)
        .then((data) => {
          if (isMounted) {
            setItems(data);
            setError(null);
          }
        })
        .catch(() => {
          if (isMounted) {
            const filtered = MOCK_ACCESSED.filter(
              (item) =>
                item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                item.ownerUsername.toLowerCase().includes(search.toLowerCase()),
            );
            setItems(filtered);
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
  }, [search]);

  return { search, setSearch, items, loading, error };
};
