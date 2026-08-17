// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/components/share/CreateShareModal.tsx

import React, { useEffect, useState } from "react";
import { createFileShare, createTextShare } from "../../api/shareApi";
import { getUploads } from "../../api/dashboardApi";
import type { MyUploadResponse } from "../../types/file";

interface CreateShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialFileId?: string;
}

const EXPIRATION_MINUTES: Record<string, number> = {
  "1h": 60,
  "24h": 1440,
  "7d": 10080,
};

export const CreateShareModal: React.FC<CreateShareModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialFileId,
}) => {
  const [shareType, setShareType] = useState<"FILE" | "TEXT">("FILE");
  // fileId is only initialized from initialFileId on mount. If a parent component reopens this modal with a different initialFileId without remounting it, the caller must pass a distinct key prop (e.g. key={initialFileId}) on <CreateShareModal /> to force a fresh mount, rather than relying on this component to re-sync internally.
  const [fileId, setFileId] = useState<string>(initialFileId || "");
  const [myUploads, setMyUploads] = useState<MyUploadResponse[]>([]);
  const [uploadsLoading, setUploadsLoading] = useState<boolean>(false);
  const [manualEntry, setManualEntry] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [accessType, setAccessType] = useState<
    "AUTHENTICATED_USER" | "PASSWORD"
  >("AUTHENTICATED_USER");
  const [password, setPassword] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("24h");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && shareType === "FILE") {
      let isMounted = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUploadsLoading(true);

      getUploads()
        .then((data) => {
          if (isMounted) {
            setMyUploads(data);
            if (!fileId && data.length > 0) {
              setFileId(data[0].id);
            }
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch user uploads", err);
        })
        .finally(() => {
          if (isMounted) {
            setUploadsLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shareType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const expiryMinutes = EXPIRATION_MINUTES[expiration] || 1440;
      let res;

      const payload = {
        accessType,
        ...(accessType === "PASSWORD" && password ? { password } : {}),
        expiryMinutes,
      };

      if (shareType === "FILE") {
        res = await createFileShare(fileId, payload);
      } else {
        res = await createTextShare({
          textContent,
          ...payload,
        });
      }

      const link = `${window.location.origin}/share/${res.token}`;
      setGeneratedLink(link);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("Failed to create share. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
    }
  };

  const handleResetAndClose = () => {
    setGeneratedLink(null);
    setError(null);
    setFileId("");
    setTextContent("");
    setAccessType("AUTHENTICATED_USER");
    setPassword("");
    setExpiration("24h");
    setManualEntry(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-6 text-[#E2E8F0]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Secure Share</h2>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="text-gray-400 hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {generatedLink ?
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Your share link has been created! Anyone with this link can view
              the content until it expires.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm font-mono text-[#E2E8F0] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold px-4 py-2 rounded-lg text-sm transition-colors shrink-0">
                Copy
              </button>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white py-2 rounded-lg text-sm transition-colors mt-2">
              Done
            </button>
          </div>
        : <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-[#181B28] p-1 rounded-lg border border-[#4A5568]">
              <button
                type="button"
                onClick={() => setShareType("FILE")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  shareType === "FILE" ?
                    "bg-[#1E2233] text-[#D9A066] shadow"
                  : "text-gray-400 hover:text-white"
                }`}>
                📁 File Share
              </button>
              <button
                type="button"
                onClick={() => setShareType("TEXT")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  shareType === "TEXT" ?
                    "bg-[#1E2233] text-[#D9A066] shadow"
                  : "text-gray-400 hover:text-white"
                }`}>
                📝 Text Share
              </button>
            </div>

            {shareType === "FILE" ?
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Select File
                </label>
                {manualEntry ?
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Enter file ID..."
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                      className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066]"
                    />
                    <button
                      type="button"
                      onClick={() => setManualEntry(false)}
                      className="text-xs text-[#D9A066] hover:underline mt-1 inline-block">
                      Choose from my uploads
                    </button>
                  </div>
                : <div>
                    {uploadsLoading ?
                      <>
                        <select
                          disabled
                          className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed opacity-75">
                          <option>Loading your files...</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setManualEntry(true)}
                          className="text-xs text-[#D9A066] hover:underline mt-1 inline-block">
                          Enter file ID manually
                        </button>
                      </>
                    : myUploads.length === 0 ?
                      <div>
                        <p className="text-sm text-gray-400 py-1">
                          You haven't uploaded any files yet
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a file first, then come back here to share it.
                        </p>
                      </div>
                    : <>
                        <select
                          required
                          value={fileId}
                          onChange={(e) => setFileId(e.target.value)}
                          className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#D9A066]">
                          {myUploads.map((upload) => (
                            <option key={upload.id} value={upload.id}>
                              {upload.originalFileName}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setManualEntry(true)}
                          className="text-xs text-[#D9A066] hover:underline mt-1 inline-block">
                          Enter file ID manually
                        </button>
                      </>
                    }
                  </div>
                }
              </div>
            : <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Text Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste sensitive text or notes..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066]"
                />
              </div>
            }

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Access Control
              </label>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="accessType"
                    value="AUTHENTICATED_USER"
                    checked={accessType === "AUTHENTICATED_USER"}
                    onChange={() => setAccessType("AUTHENTICATED_USER")}
                    className="accent-[#D9A066]"
                  />
                  Authenticated Users
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="accessType"
                    value="PASSWORD"
                    checked={accessType === "PASSWORD"}
                    onChange={() => setAccessType("PASSWORD")}
                    className="accent-[#D9A066]"
                  />
                  Password Protected
                </label>
              </div>

              {accessType === "PASSWORD" && (
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    placeholder="Enter access password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Expiration
              </label>
              <select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#D9A066]">
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                {loading && (
                  <div className="w-3.5 h-3.5 border-2 border-[#181B28] border-t-transparent rounded-full animate-spin" />
                )}
                Generate Link
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
};

export default CreateShareModal;
