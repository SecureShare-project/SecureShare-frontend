import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const username = useAuthStore((state) => state.username);
  const email = useAuthStore((state) => state.email);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/browse?search=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="h-16 border-b border-[#4A5568] bg-[#181B28] px-6 flex items-center justify-between sticky top-0 z-40">
      <form onSubmit={handleSearchSubmit} className="relative w-72">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="w-full pl-9 pr-4 py-1.5 bg-[#1E2233] border border-[#4A5568] rounded-lg text-sm text-[#E2E8F0] placeholder-gray-400 focus:outline-none focus:border-[#D9A066] transition-colors"
        />
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-sm font-medium text-[#E2E8F0]">
            {username || "User"}
          </span>
          {email && <span className="text-xs text-gray-400">{email}</span>}
        </div>
        <div className="w-9 h-9 rounded-full bg-[#D9A066] text-[#181B28] font-bold flex items-center justify-center text-sm shadow">
          {(username || email || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
