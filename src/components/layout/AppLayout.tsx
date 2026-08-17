// src/components/layout/AppLayout.tsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-[#1E2233] text-[#E2E8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
