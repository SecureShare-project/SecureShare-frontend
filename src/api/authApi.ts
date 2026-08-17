// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/api/authApi.ts

import axiosClient from "./axiosClient";
import type {
  LoginRequest,
  AuthResponse,
  SignUpRequest,
  OtpVerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateUsernameRequest,
  UpdatePasswordRequest,
  UserProfileResponse,
} from "../types/auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/api/auth/login",
    data,
  );
  return response.data;
};

export const signup = async (data: SignUpRequest): Promise<void> => {
  await axiosClient.post("/api/auth/signup", data);
};

export const verifyOtp = async (
  data: OtpVerifyRequest,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    "/api/auth/verify-otp",
    data,
  );
  return response.data;
};

export const resendOtp = async (email: string): Promise<void> => {
  await axiosClient.post("/api/auth/resend-otp", { email });
};

export const forgotPassword = async (
  data: ForgotPasswordRequest,
): Promise<void> => {
  await axiosClient.post("/api/auth/forgot-password", data);
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<void> => {
  await axiosClient.post("/api/auth/reset-password", data);
};

export const getProfile = async (): Promise<UserProfileResponse> => {
  const response =
    await axiosClient.get<UserProfileResponse>("/api/profile/me");
  return response.data;
};

export const updateUsername = async (
  data: UpdateUsernameRequest,
): Promise<void> => {
  await axiosClient.put("/api/profile/username", data);
};

export const updatePassword = async (
  data: UpdatePasswordRequest,
): Promise<void> => {
  await axiosClient.put("/api/profile/password", data);
};

export const deleteAccount = async (): Promise<void> => {
  await axiosClient.delete("/api/profile/me");
};
