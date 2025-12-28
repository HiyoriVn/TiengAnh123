"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { login } from "@/lib/api";
import { getDashboardRoute } from "@/lib/utils";
import AuthHeader from "@/components/navigation/AuthHeader";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      router.replace(dashboardRoute);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: apiError } = await login({ email, password });

      if (apiError) {
        setError(
          apiError.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
        return;
      }

      if (!data) {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }

      // Lưu auth state vào context
      authLogin(data.access_token, data.user);

      // Redirect theo role
      const dashboardRoute = getDashboardRoute(data.user.role);
      router.push(dashboardRoute);
    } catch (err) {
      setError("Đã có lỗi không xác định. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-300 via-white to-blue-100 dark:from-gray-900 dark:to-brand-blue min-h-screen flex flex-col text-[#181112] dark:text-white">
      {/* --- HEADER --- */}
      <AuthHeader />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        {/* THAY ĐỔI: bg-white -> bg-brand-blue, thêm text-white */}
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-brand-blue rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 text-white">
          {/* LEFT SIDE: FORM (Nền xanh Brand Blue) */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Đăng nhập
              </h1>
              {/* THAY ĐỔI: Màu chữ phụ sáng hơn để đọc trên nền xanh */}
              <p className="text-blue-200">
                Chào mừng bạn quay trở lại với TiengAnh123.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded bg-red-50 text-brand-red text-sm border border-red-100 flex gap-2 items-center">
                <span className="material-symbols-outlined text-base">
                  error
                </span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <label className="block">
                <span className="text-white text-sm font-semibold mb-1.5 block">
                  Email
                </span>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // THAY ĐỔI: Input nền trắng, chữ đen để nổi bật trên nền xanh
                    className="w-full rounded-lg border-transparent bg-white text-brand-blue placeholder:text-gray-400 h-12 pl-4 pr-10 focus:border-brand-peach focus:ring-brand-peach focus:ring-2 transition-colors"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">
                    mail
                  </span>
                </div>
              </label>

              <label className="block">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white text-sm font-semibold">
                    Mật khẩu
                  </span>
                  <Link
                    href="/forgot-password"
                    className="text-brand-peach hover:text-white text-sm font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // THAY ĐỔI: Input nền trắng
                    className="w-full rounded-lg border-transparent bg-white text-brand-blue placeholder:text-gray-400 h-12 pl-4 pr-10 focus:border-brand-peach focus:ring-brand-peach focus:ring-2 transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-brand-blue"
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                </div>
              </label>

              {/* Nút đăng nhập giữ nguyên màu đỏ (hoặc chuyển sang màu Accent Peach nếu muốn) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-red h-12 px-5 text-white text-base font-bold shadow-lg shadow-black/20 hover:bg-brand-red/90 transition-all mt-2 disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
              </button>
            </form>

            <div className="relative mt-8 mb-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                {/* THAY ĐỔI: Đường kẻ mờ màu trắng */}
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-brand-blue px-4 text-xs font-semibold uppercase text-blue-200 tracking-wider">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* THAY ĐỔI: Nút Social nền trong suốt viền trắng hoặc nền trắng mờ */}
              <button className="flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 h-10 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 h-10 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                Facebook
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200">
                Bạn chưa có tài khoản?
                <Link
                  className="text-brand-peach font-bold hover:underline ml-1"
                  href="/register"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: BRANDING (Giữ nguyên hoặc chỉnh nhẹ cho đồng bộ) */}
          <div className="hidden md:flex flex-1 relative bg-brand-blue items-center justify-center overflow-hidden p-12 border-l border-white/10">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-brand-teal rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-brand-cyan rounded-full opacity-30 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6 shadow-xl border border-white/10">
                <span className="material-symbols-outlined text-4xl text-white">
                  school
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                Học tiếng Anh <br />
                <span className="text-brand-cyan">Chưa bao giờ dễ đến thế</span>
              </h2>
              <p className="text-brand-peach/80 text-lg">
                Tham gia cùng 500,000+ học viên và chinh phục mục tiêu của bạn.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
