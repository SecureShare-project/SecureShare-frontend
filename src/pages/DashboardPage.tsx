import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { UploadsTable } from "../components/dashboard/UploadsTable";
import { SharesTable } from "../components/dashboard/SharesTable";
import { AccessedTable } from "../components/dashboard/AccessedTable";
import { CreateShareModal } from "../components/share/CreateShareModal";

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"uploads" | "shares" | "accessed">(
    "uploads",
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareRefreshKey, setShareRefreshKey] = useState<number>(0);

  return (
    <AppLayout>
      <div className="text-[#E2E8F0]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#4A5568] pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage your uploaded files, active share links, and accessed
                items
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold px-4 py-2.5 rounded-lg text-sm transition-colors shadow-lg flex items-center gap-2 shrink-0">
              <span>+</span> Create Share
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#4A5568] gap-6 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("uploads")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "uploads" ?
                  "border-[#D9A066] text-[#D9A066]"
                : "border-transparent text-gray-400 hover:text-white"
              }`}>
              My Uploads
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shares")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "shares" ?
                  "border-[#D9A066] text-[#D9A066]"
                : "border-transparent text-gray-400 hover:text-white"
              }`}>
              Active Shares
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("accessed")}
              className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "accessed" ?
                  "border-[#D9A066] text-[#D9A066]"
                : "border-transparent text-gray-400 hover:text-white"
              }`}>
              Accessed Items
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "uploads" && <UploadsTable />}
            {activeTab === "shares" && <SharesTable key={shareRefreshKey} />}
            {activeTab === "accessed" && <AccessedTable />}
          </div>
        </div>

        {/* Share Creation Modal */}
        <CreateShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onSuccess={() => setShareRefreshKey((k) => k + 1)}
        />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
