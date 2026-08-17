// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/pages/ShareAccessPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShareMeta, accessShare } from "../api/shareApi";
import type { ShareMetaResponse, ShareAccessResponse } from "../types/share";

export const ShareAccessPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [meta, setMeta] = useState<ShareMetaResponse | null>(null);
  const [content, setContent] = useState<ShareAccessResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [invalidOrExpired, setInvalidOrExpired] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [unlockLoading, setUnlockLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInvalidOrExpired(true);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getShareMeta(token)
      .then((data) => {
        if (!isMounted) return;
        if (data.expired) {
          setInvalidOrExpired(true);
        } else {
          setMeta(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setInvalidOrExpired(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) return;

    setError(null);
    setUnlockLoading(true);

    try {
      const res = await accessShare(token, {
        password: meta?.accessType === "PASSWORD" ? password : undefined,
      });
      setContent(res);
    } catch {
      setError(
        "Incorrect password or failed to access share. Please try again.",
      );
    } finally {
      setUnlockLoading(false);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-[#D9A066] border-t-transparent rounded-full animate-spin" />
          <span>Verifying share link...</span>
        </div>
      </div>
    );
  }

  if (invalidOrExpired || !meta) {
    return (
      <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-2xl shadow-2xl p-8 text-center text-[#E2E8F0]">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Link Unavailable
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            This share link is invalid or has expired. Please request a new link
            from the sender.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4 text-[#E2E8F0]">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-2xl shadow-2xl p-8">
        {/* Post-Unlock View */}
        {content ?
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#181B28] border border-[#4A5568] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                {content.type === "FILE" ? "📁" : "📝"}
              </div>
              <h1 className="text-xl font-bold text-white truncate">
                {content.name}
              </h1>
              {content.sizeBytes !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(content.sizeBytes)}
                </p>
              )}
            </div>

            {content.type === "TEXT" ?
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Shared Content
                </label>
                <pre className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl p-4 text-sm font-mono text-gray-200 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                  {content.textContent ||
                    content.textPreview ||
                    "No text content."}
                </pre>
              </div>
            : <div className="space-y-4">
                {content.downloadUrl ?
                  <a
                    href={content.downloadUrl}
                    download
                    className="w-full bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold py-3 rounded-xl text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
                    <span>📥</span> Download File
                  </a>
                : <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
                    Download URL not available for this item.
                  </div>
                }
              </div>
            }
          </div>
        : /* Pre-Unlock View */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#181B28] border border-[#4A5568] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔒
              </div>
              <h1 className="text-xl font-bold text-white truncate">
                {meta.itemName}
              </h1>
              {meta.sizeBytes !== undefined && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(meta.sizeBytes)}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {meta.accessType === "PASSWORD" ?
              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Password Protected Share
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter access password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={unlockLoading}
                  className="w-full bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                  {unlockLoading && (
                    <div className="w-4 h-4 border-2 border-[#181B28] border-t-transparent rounded-full animate-spin" />
                  )}
                  Unlock Item
                </button>
              </form>
            : <div className="space-y-4 text-center">
                <p className="text-xs text-gray-400">
                  This item requires an authenticated account to access.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/login?redirect=/share/${token}`)}
                  className="w-full bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-medium py-2 rounded-xl text-xs transition-colors">
                  Log In to Access
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default ShareAccessPage;
