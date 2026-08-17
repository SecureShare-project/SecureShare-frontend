import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// Public Pages
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { OtpVerifyPage } from "./pages/OtpVerifyPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ShareAccessPage } from "./pages/ShareAccessPage";

// Protected Pages
import { DashboardPage } from "./pages/DashboardPage";
import { BrowsePage } from "./pages/BrowsePage";
import { ProfilePage } from "./pages/ProfilePage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/share/:token" element={<ShareAccessPage />} />

        {/* Protected Layout Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Root Redirect - ProtectedRoute handles unauthenticated users */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all Wildcard Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
