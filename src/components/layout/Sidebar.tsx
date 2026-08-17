// src/components/layout/Sidebar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Browse", path: "/browse" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-[#1E2233] border-r border-[#4A5568] flex flex-col justify-between p-4 min-h-screen">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-[#4A5568]">
          <span className="text-[#D9A066] text-2xl font-bold">
            🛡️ SecureShare
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive ?
                    "bg-[#4A5568] text-[#D9A066]"
                  : "text-[#E2E8F0] hover:bg-[#4A5568]/50"
                }`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 rounded text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors">
        Logout
      </button>
    </aside>
  );
};
