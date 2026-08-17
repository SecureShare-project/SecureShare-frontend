// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/pages/ProfilePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuthStore } from "../store/authStore";
import {
  updateUsername as updateUsernameApi,
  updatePassword,
  deleteAccount,
} from "../api/authApi";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  const [usernameInput, setUsernameInput] = useState(username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameLoading, setUsernameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!usernameInput.trim()) {
      setErrorMsg("Username cannot be empty.");
      return;
    }

    setUsernameLoading(true);
    try {
      await updateUsernameApi({ newUsername: usernameInput });
      useAuthStore.getState().updateUsername(usernameInput);
      setSuccessMsg("Username updated successfully.");
      setErrorMsg(null);
    } catch {
      setErrorMsg("Failed to update username.");
      setSuccessMsg(null);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccessMsg("Password updated successfully.");
      setErrorMsg(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMsg("Failed to update password.");
      setSuccessMsg(null);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteAccount();
      logout();
      navigate("/login");
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-[#E2E8F0]">
        {/* Header */}
        <div className="border-b border-[#4A5568] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your profile details, security preferences, and account
            lifecycle.
          </p>
        </div>

        {/* Banners */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-sm rounded-xl">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-950/50 border border-rose-800 text-rose-300 text-sm rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Account Info */}
        <div className="bg-[#1E2233] border border-[#4A5568] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-[#4A5568]/50 pb-3">
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold mb-1">
                Username
              </span>
              <span className="font-medium text-white">{username || "—"}</span>
            </div>
          </div>
        </div>

        {/* Update Username */}
        <form
          onSubmit={handleUpdateUsername}
          className="bg-[#1E2233] border border-[#4A5568] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-[#4A5568]/50 pb-3">
            Change Username
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              New Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
              placeholder="Enter new username..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={usernameLoading}
              className="bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg">
              {usernameLoading && (
                <div className="w-4 h-4 border-2 border-[#181B28] border-t-transparent rounded-full animate-spin" />
              )}
              Save Username
            </button>
          </div>
        </form>

        {/* Update Password */}
        <form
          onSubmit={handleUpdatePassword}
          className="bg-[#1E2233] border border-[#4A5568] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-[#4A5568]/50 pb-3">
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                placeholder="Enter current password..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                placeholder="Enter new password..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#181B28] border border-[#4A5568] rounded-xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-gray-500 focus:outline-none focus:border-[#D9A066] transition-colors"
                placeholder="Confirm new password..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg">
              {passwordLoading && (
                <div className="w-4 h-4 border-2 border-[#181B28] border-t-transparent rounded-full animate-spin" />
              )}
              Update Password
            </button>
          </div>
        </form>

        {/* Session */}
        <div className="bg-[#1E2233] border border-[#4A5568] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-[#4A5568]/50 pb-3">
            Session
          </h2>
          <p className="text-sm text-gray-400">
            Sign out of your account on this device.
          </p>
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Log Out
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-[#1E2233] border border-rose-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-rose-400 border-b border-[#4A5568]/50 pb-3">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-400">
            Deleting your account will permanently purge your access and
            associated data. This action cannot be undone.
          </p>
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setIsDeleteModalOpen(true);
              }}
              className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-2xl shadow-2xl p-6 text-[#E2E8F0] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Confirm Account Deletion
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Are you sure you want to delete your account? All active data
                  will be permanently removed.
                </p>
              </div>

              {deleteError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-xl">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-[#4A5568]/30 hover:bg-[#4A5568]/50 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                  {deleteLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
