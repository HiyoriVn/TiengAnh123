"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks";
import { getDashboardRoute } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

/**
 * LandingPageHeader - Header cho trang chủ, courses listing
 * Hiển thị dropdown menu khi đã login
 */
export default function LandingPageHeader() {
  const router = useRouter();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown khi click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = () => {
    authLogout();
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleDashboard = () => {
    if (user) {
      router.push(getDashboardRoute(user.role));
      setDropdownOpen(false);
    }
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
            <div className="relative" ref={dropdownRef}>
              {/* User Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
                  style={
                    user.avatar
                      ? {
                          backgroundImage: `url(${user.avatar})`,
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  {!user.avatar && user.fullName?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button
                    onClick={handleDashboard}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
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
