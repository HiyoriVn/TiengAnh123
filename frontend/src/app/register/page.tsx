"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { register } from "@/lib/api";
import { getDashboardRoute } from "@/lib/utils";
import AuthHeader from "@/components/navigation/AuthHeader";

export default function RegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      router.replace(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    try {
      const { error } = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.username,
        username: formData.email.split("@")[0],
      });

      if (error) {
        alert(error.message || "Lỗi đăng ký (Email có thể đã tồn tại)");
        return;
      }

      alert("Đăng ký thành công!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Lỗi đăng ký (Email có thể đã tồn tại)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-auth-light dark:bg-bg-auth-dark font-display min-h-screen flex flex-col text-[#181112] dark:text-white">
      {/* --- HEADER --- */}
      <AuthHeader />

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex w-full">
        {/* Left Panel: Branding (Giữ nguyên thiết kế đẹp của bạn) */}
        <div className="hidden lg:flex w-1/2 relative bg-brand-blue flex-col justify-between p-12 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-teal rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-cyan rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 my-auto max-w-lg">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Chinh phục tiếng Anh
              <br />
              <span className="text-brand-cyan">toàn diện 4 kỹ năng</span>
            </h1>
            <p className="text-brand-peach/90 text-lg mb-8 leading-relaxed">
              Tham gia cộng đồng học tiếng Anh trực tuyến hàng đầu Việt Nam.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-brand-red bg-white/10 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-medium">
                  Luyện tập Nghe - Nói - Đọc - Viết
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-brand-red bg-white/10 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-medium">
                  Hệ thống kiểm tra & đánh giá chuẩn xác
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <span className="material-symbols-outlined text-brand-red bg-white/10 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-medium">
                  Học vui hơn với Gamification
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-brand-cyan/60 text-sm font-medium">
            © 2024 TiengAnh123. All rights reserved.
          </div>
        </div>

        {/* Right Panel: Registration Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative">
          <div className="w-full max-w-[520px] bg-white dark:bg-[#2a1d1f] p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[#181112] dark:text-white mb-2">
                Đăng ký tài khoản
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã có tài khoản?
                <Link
                  className="text-brand-red font-semibold hover:underline ml-1"
                  href="/login"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <label className="block">
                <span className="text-[#181112] dark:text-gray-200 text-sm font-semibold mb-1.5 block">
                  Tên người dùng
                </span>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="Nhập tên hiển thị"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 bg-white dark:bg-white/5 dark:border-white/10 text-[#181112] dark:text-white placeholder:text-gray-400 h-12 px-4 focus:border-brand-red focus:ring-brand-red focus:ring-1 transition-colors"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                    person
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-[#181112] dark:text-gray-200 text-sm font-semibold mb-1.5 block">
                  Email
                </span>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 bg-white dark:bg-white/5 dark:border-white/10 text-[#181112] dark:text-white placeholder:text-gray-400 h-12 px-4 focus:border-brand-red focus:ring-brand-red focus:ring-1 transition-colors"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 text-[20px]">
                    mail
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-[#181112] dark:text-gray-200 text-sm font-semibold mb-1.5 block">
                  Mật khẩu
                </span>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Tối thiểu 8 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 bg-white dark:bg-white/5 dark:border-white/10 text-[#181112] dark:text-white placeholder:text-gray-400 h-12 px-4 pr-10 focus:border-brand-red focus:ring-brand-red focus:ring-1 transition-colors"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[#181112] dark:text-gray-200 text-sm font-semibold mb-1.5 block">
                  Xác nhận mật khẩu
                </span>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 bg-white dark:bg-white/5 dark:border-white/10 text-[#181112] dark:text-white placeholder:text-gray-400 h-12 px-4 pr-10 focus:border-brand-red focus:ring-brand-red focus:ring-1 transition-colors"
                  />
                </div>
              </label>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex h-6 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-brand-red focus:ring-brand-red dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor="terms"
                    className="font-medium text-gray-600 dark:text-gray-400"
                  >
                    Tôi đồng ý với{" "}
                    <a
                      href="#"
                      className="font-semibold text-brand-red hover:text-brand-red/80"
                    >
                      Điều khoản sử dụng
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="font-semibold text-brand-red hover:text-brand-red/80"
                    >
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-lg bg-brand-red py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-brand-red/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red transition-all mt-4 disabled:opacity-70"
              >
                {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
              </button>
            </form>

            <div className="relative mt-8 mb-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-[#2a1d1f] px-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  Hoặc đăng ký với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="hidden sm:inline">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <span className="hidden sm:inline">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
