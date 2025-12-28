"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "Email khôi phục đã được gửi!");
      setEmail("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-300 via-white to-blue-100 dark:from-gray-900 dark:to-brand-blue min-h-screen flex flex-col text-[#181112] dark:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-10 py-3 border-b border-gray-200 dark:border-brand-blue bg-white dark:bg-brand-darkest">
        <div className="flex items-center gap-4">
          <div className="size-10 text-brand-dark flex items-center justify-center rounded-lg bg-brand-light dark:bg-brand-dark dark:text-brand-light">
            <span className="material-symbols-outlined text-3xl">school</span>
          </div>
          <h2 className="text-brand-darkest dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            TiengAnh123
          </h2>
        </div>
        <div className="hidden md:flex gap-2">
          <Link
            href="/register"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-brand-medium text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-brand-dark transition-colors shadow-sm"
          >
            <span className="truncate">Đăng ký</span>
          </Link>
          <Link
            href="/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-brand-light/50 dark:bg-brand-dark text-brand-darkest dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-brand-light transition-colors"
          >
            <span className="truncate">Đăng nhập</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 md:py-20">
        <div className="w-full max-w-[480px] flex flex-col items-center bg-white dark:bg-card-dark p-8 rounded-2xl shadow-lg border border-brand-medium/20 dark:border-brand-dark">
          <div className="size-14 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-teal dark:text-brand-light">
            <span className="material-symbols-outlined text-[28px]">
              lock_reset
            </span>
          </div>
          <h1 className="text-brand-darkest dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-3">
            Quên mật khẩu?
          </h1>
          <p className="text-brand-dark dark:text-brand-light/80 text-base font-normal leading-relaxed text-center pb-8 max-w-[90%]">
            Đừng lo lắng! Hãy nhập địa chỉ email đã đăng ký của bạn và chúng tôi
            sẽ gửi liên kết để đặt lại mật khẩu.
          </p>

          {message && (
            <div className="w-full mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="w-full mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col w-full">
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-brand-darkest dark:text-white text-sm font-medium leading-normal">
                  Email
                </span>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-brand-dark dark:text-brand-light h-5 w-5" />
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-brand-darkest dark:text-white focus:outline-0 focus:ring-2 focus:ring-brand-medium border border-brand-medium/40 dark:border-brand-medium bg-white dark:bg-background-dark focus:border-brand-medium h-12 pl-11 pr-4 placeholder:text-brand-dark/40 dark:placeholder:text-brand-light/40 text-base font-normal leading-normal"
                    placeholder="vidu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-accent hover:bg-accent/90 text-brand-darkest text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  <span className="truncate">Đang gửi...</span>
                </>
              ) : (
                <span className="truncate">Gửi liên kết khôi phục</span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-8 group cursor-pointer">
            <ArrowLeft className="h-4 w-4 text-brand-dark dark:text-brand-light group-hover:text-brand-medium transition-colors" />
            <Link
              href="/login"
              className="text-brand-dark dark:text-brand-light text-sm font-semibold leading-normal group-hover:text-brand-medium transition-colors"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
