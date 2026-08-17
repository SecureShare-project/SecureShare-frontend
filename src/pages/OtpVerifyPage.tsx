// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/pages/OtpVerifyPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { verifyOtp, resendOtp } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { OtpInput } from "../components/auth/OtpInput";

export const OtpVerifyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const [expiryTimer, setExpiryTimer] = useState(210);
  const [resendTimer, setResendTimer] = useState(90);

  useEffect(() => {
    if (!email) return;

    const interval = setInterval(() => {
      setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setError(null);

    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (expiryTimer === 0) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtp({ email, otpCode: otp });
      setAuth(res.token, res.username, res.email);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Verification failed. Invalid or expired OTP.",
        );
      } else {
        setError("Verification failed. Invalid or expired OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendTimer > 0) return;

    setError(null);
    setResendMessage(null);
    setResendLoading(true);

    try {
      await resendOtp(email);
      setResendMessage("A new verification code has been sent to your email.");
      setExpiryTimer(210);
      setResendTimer(90);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to resend OTP. Please try again.",
        );
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#E2E8F0]">
            Verify Your Email
          </h1>
          <p className="text-sm text-gray-400">
            We sent a 6-digit code to{" "}
            <span className="text-[#E2E8F0] font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-sm p-3 rounded-md text-center">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <OtpInput onChange={setOtp} />

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Code expires in:{" "}
              <span
                className={`font-mono font-medium ${
                  expiryTimer === 0 ? "text-red-400" : "text-[#D9A066]"
                }`}>
                {formatTime(expiryTimer)}
              </span>
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || resendLoading}
              className="text-[#D9A066] hover:text-[#e0ad79] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none">
              {resendLoading ?
                "Sending..."
              : resendTimer > 0 ?
                `Resend in ${formatTime(resendTimer)}`
              : "Resend Code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || expiryTimer === 0}
            className="w-full py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Want to use a different account?{" "}
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

export default OtpVerifyPage;
