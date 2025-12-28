"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Book, Settings, PenTool, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks";
import { getDashboardRoute } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-700 flex items-center gap-2"
        >
          <Book className="w-8 h-8" />
          TiengAnh123
        </Link>

        {/* Menu bên phải */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Trang chủ
          </Link>

          {isAuthenticated && user ? (
            <>
              {/* --- MENU RIÊNG THEO QUYỀN (ROLE) --- */}

              {user.role === "STUDENT" && (
                <Link
                  href="/my-courses"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Khóa học của tôi
                </Link>
              )}

              {user.role === "LECTURER" && (
                <>
                  <Link
                    href="/teacher/grading"
                    className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    <PenTool size={16} /> Chấm điểm
                  </Link>
                </>
              )}

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                >
                  <Settings size={16} /> Quản trị
                </Link>
              )}

              {/* --- THÔNG TIN TÀI KHOẢN --- */}
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>

                {/* Dashboard Button */}
                <Link
                  href={getDashboardRoute(user.role)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition"
                  title="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
