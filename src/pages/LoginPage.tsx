import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import PasswordField from "../components/auth/PasswordField";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      setAuth(res.token, res.username, res.email);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181B28] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E2233] border border-[#4A5568] rounded-xl shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#E2E8F0]">Welcome Back</h1>
          <p className="text-sm text-gray-400">
            Sign in to access your secure dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#D9A066] hover:text-[#e0ad79] transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#D9A066] hover:bg-[#e0ad79] text-[#181B28] font-semibold rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#D9A066] hover:text-[#e0ad79] transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
