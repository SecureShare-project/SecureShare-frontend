// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/pages/BrowsePage.tsx

import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import type { FileRecordResponse } from "../types/file";

export const BrowsePage: React.FC = () => {
  const { search, setSearch, uploader, setUploader, files, loading, error } =
    useGlobalSearch();

  const [selectedFile, setSelectedFile] = useState<FileRecordResponse | null>(
    null,
  );

  const hasSearched = search.length > 0 || uploader.length > 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <AppLayout>
      <div className="text-[#E2E8F0]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-[#4A5568] pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Global File Explorer
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Search and explore files shared across the network
            </p>
          </div>

          {/* Search Controls */}
          <div className="bg-[#1E2233] border border-[#4A5568] rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Filename / Query
                </label>
                <input
                  type="text"
                  placeholder="Filter by filename..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Uploader
                </label>
                <input
                  type="text"
                  placeholder="Filter by uploader username..."
                  value={uploader}
                  onChange={(e) => setUploader(e.target.value)}
                  className="w-full bg-[#181B28] border border-[#4A5568] rounded-lg px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Results State */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          {loading ?
            <div className="p-12 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#D9A066] border-t-transparent rounded-full animate-spin" />
              Searching files...
            </div>
          : files.length === 0 ?
            <div className="p-12 text-center text-gray-400 text-sm bg-[#1E2233] border border-[#4A5568] rounded-xl">
              {hasSearched ?
                "No files found matching your search criteria."
              : "Start typing to search global files."}
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="bg-[#1E2233] border border-[#4A5568] hover:border-[#D9A066] rounded-xl p-5 shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 bg-[#181B28] border border-[#4A5568] rounded-lg text-xl">
                        📄
                      </div>
                      <span className="text-xs font-mono bg-[#181B28] border border-[#4A5568] px-2 py-0.5 rounded text-gray-400">
                        {file.contentType.split("/")[1] || file.contentType}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-[#D9A066] transition-colors truncate text-base">
                      {file.originalFileName}
                    </h3>
                  </div>

                  <div className="border-t border-[#4A5568]/50 pt-3 text-xs text-gray-400 flex justify-between items-center">
                    <span>
                      Uploaded by{" "}
                      <strong className="text-gray-300 font-medium">
                        {file.uploadedByUsername}
                      </strong>
                    </span>
                    <span>{formatFileSize(file.fileSize)}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* File Details / Metadata Modal */}
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-6 text-[#E2E8F0] space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">File Details</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Metadata overview for selected record
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-white text-lg font-bold">
                  ✕
                </button>
              </div>

              <div className="space-y-3 bg-[#181B28] border border-[#4A5568] rounded-lg p-4 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#4A5568]/50">
                  <span className="text-gray-400">File ID:</span>
                  <span className="font-mono text-xs text-gray-200">
                    {selectedFile.id}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4A5568]/50">
                  <span className="text-gray-400">Original Name:</span>
                  <span className="font-medium text-white truncate max-w-[240px]">
                    {selectedFile.originalFileName}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4A5568]/50">
                  <span className="text-gray-400">Content Type:</span>
                  <span className="font-mono text-xs text-gray-300">
                    {selectedFile.contentType}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4A5568]/50">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-gray-200">
                    {formatFileSize(selectedFile.fileSize)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4A5568]/50">
                  <span className="text-gray-400">Uploaded By:</span>
                  <span className="font-medium text-[#D9A066]">
                    {selectedFile.uploadedByUsername}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Uploaded At:</span>
                  <span className="text-gray-200">
                    {formatDate(selectedFile.uploadedAt)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BrowsePage;
