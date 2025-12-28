"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Key, CheckCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length < 6) return 1;
    if (newPassword.length < 10) return 2;
    if (
      newPassword.match(/[a-z]/) &&
      newPassword.match(/[A-Z]/) &&
      newPassword.match(/[0-9]/)
    )
      return 3;
    return 4;
  };

  const strength = getPasswordStrength();
  const strengthText = ["", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const strengthColor = [
    "",
    "text-red-500",
    "text-yellow-500",
    "text-green-500",
    "text-green-600",
  ];

  if (success) {
    return (
      <div className="w-full max-w-[480px] flex flex-col items-center bg-white dark:bg-card-dark p-8 rounded-2xl shadow-lg border border-green-200 dark:border-green-800">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-brand-darkest dark:text-white text-2xl font-bold text-center mb-3">
          Đặt lại mật khẩu thành công!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Mật khẩu của bạn đã được cập nhật. Đang chuyển đến trang đăng nhập...
        </p>
        <Loader2 className="animate-spin h-8 w-8 text-brand-medium" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex flex-col items-center bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-brand-blue/30 overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-4 text-center w-full">
        <div className="size-14 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-teal dark:text-brand-light">
          <span className="material-symbols-outlined text-[28px]">
            lock_reset
          </span>
        </div>
        <h1 className="text-brand-dark dark:text-white text-2xl font-bold leading-tight mb-2">
          Đặt lại mật khẩu
        </h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm font-normal leading-relaxed max-w-xs mx-auto">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {/* Form Section */}
      <div className="px-8 pb-8 pt-2 w-full">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Field */}
          <div className="space-y-1.5">
            <label
              className="text-brand-dark dark:text-gray-200 text-sm font-medium"
              htmlFor="new-password"
            >
              Mật khẩu mới
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-teal">
                <Key className="h-5 w-5" />
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-blue/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all sm:text-sm"
                id="new-password"
                placeholder="Ít nhất 6 ký tự"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-teal cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {newPassword && (
              <>
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 rounded-full ${
                        level <= strength
                          ? "bg-brand-teal"
                          : "bg-gray-200 dark:bg-brand-blue/30"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Độ mạnh:{" "}
                  <span className={`font-medium ${strengthColor[strength]}`}>
                    {strengthText[strength]}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label
              className="text-brand-dark dark:text-gray-200 text-sm font-medium"
              htmlFor="confirm-password"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-teal">
                <CheckCircle className="h-5 w-5" />
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-blue/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all sm:text-sm"
                id="confirm-password"
                placeholder="Nhập lại mật khẩu mới"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-teal cursor-pointer"
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-primary hover:bg-primary-hover text-brand-dark font-bold text-sm transition-all shadow-lg shadow-primary/20 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Đang xử lý...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tip Footer */}
      <div className="bg-gray-50 dark:bg-brand-dark/50 px-8 py-4 border-t border-gray-100 dark:border-brand-blue/30 flex items-start gap-3 w-full">
        <span className="material-symbols-outlined text-brand-teal text-[20px] mt-0.5">
          shield
        </span>
        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <strong className="font-semibold text-gray-700 dark:text-gray-300">
            Bảo mật:
          </strong>{" "}
          Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số để
          đảm bảo an toàn.
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-brand-blue/30 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]">
                  school
                </span>
              </div>
              <h2 className="text-brand-dark dark:text-white text-xl font-bold tracking-tight">
                TiengAnh123
              </h2>
            </Link>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-brand-teal hover:text-brand-light transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-brand-teal/10 blur-[80px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-brand-blue/20 blur-[100px]"></div>
        </div>
        <div className="layout-content-container flex flex-col max-w-lg w-full z-10">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin h-12 w-12 text-brand-medium" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
