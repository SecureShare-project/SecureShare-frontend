// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/pages/ForgotPasswordPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { forgotPassword, resetPassword } from "../api/authApi";
import { OtpInput } from "../components/auth/OtpInput";
import PasswordField from "../components/auth/PasswordField";
import { validatePassword } from "../utils/validators";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleStep1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await forgotPassword({ email });
    } catch {
      // Intentionally suppressed for generic security response
    } finally {
      setLoading(false);
      setMessage(
        "If an account exists with this email, a verification code has been sent.",
      );
      setStep(2);
    }
  };

  const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    const passwordValidationError = validatePassword(newPassword);
    if (!passwordValidationError.isValid) {
      setError(passwordValidationError.message ?? "Invalid password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email, otp, newPassword });
      setMessage(
        "Password reset successful! You can now log in with your new password.",
      );
      setResetComplete(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Password reset failed.");
      } else {
        setError("Password reset failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#E2E8F0]">Reset Password</h1>
          <p className="text-sm text-gray-400">
            {resetComplete ?
              "Your password has been updated"
            : step === 1 ?
              "Enter your email to receive a password reset code"
            : "Enter the code sent to your email along with your new password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-sm p-3 rounded-md text-center">
            {message}
          </div>
        )}

        {resetComplete ?
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none">
              Go to Login
            </button>
          </div>
        : step === 1 ?
          <form onSubmit={handleStep1} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-[#E2E8F0]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 bg-[#181B28] border border-[#4A5568] rounded-md text-[#E2E8F0] placeholder-gray-400 focus:outline-none focus:border-[#D9A066] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        : <form onSubmit={handleStep2} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-[#E2E8F0] text-center">
                Verification Code
              </label>
              <OtpInput onChange={setOtp} />
            </div>

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        }

        <div className="text-center text-sm text-gray-400">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-medium text-[#D9A066] hover:text-[#e0ad79] transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
