export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface OtpVerifyRequest {
  email: string;
  otpCode: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateUsernameRequest {
  newUsername: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  username: string;
  email: string;
  verified: boolean;
}
