import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signup } from "../api/authApi";
import { validatePassword } from "../utils/validators";
import PasswordField from "../components/auth/PasswordField";

export const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.message || "Invalid password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup({ username, email, password });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create account.");
      } else {
        setError("Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#E2E8F0]">
            Create an Account
          </h1>
          <p className="text-sm text-gray-400">
            Sign up to start sharing files securely
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#E2E8F0]">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
              className="w-full px-3 py-2 bg-[#181B28] border border-[#4A5568] rounded-md text-[#E2E8F0] placeholder-gray-400 focus:outline-none focus:border-[#D9A066] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#E2E8F0]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 bg-[#181B28] border border-[#4A5568] rounded-md text-[#E2E8F0] placeholder-gray-400 focus:outline-none focus:border-[#D9A066] transition-colors"
            />
          </div>

          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#D9A066] hover:text-[#e0ad79] transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
