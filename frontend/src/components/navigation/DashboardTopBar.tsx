"use client";

import { useAuth } from "@/hooks";
import { Bell } from "lucide-react";

/**
 * DashboardTopBar - Top bar cho dashboard
 * Chứa search, notifications, user info
 */
export default function DashboardTopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 z-10 flex-shrink-0">
      {/* Mobile Menu Button */}
      <button className="lg:hidden p-2 -ml-2 text-text-main-light dark:text-white">
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
          <div className="text-right hidden sm:block">
            <p
              className="text-sm font-bold text-text-main-light dark:text-white"
              suppressHydrationWarning
            >
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-text-sub-light dark:text-gray-400">
              {user?.role === "LECTURER"
                ? "Giảng viên"
                : user?.role === "ADMIN"
                ? "Quản trị viên"
                : "Học viên"}
            </p>
          </div>
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-primary shadow-sm"
            style={{
              backgroundImage: user?.avatar
                ? `url('${user.avatar}')`
                : "url('https://ui-avatars.com/api/?name=" +
                  (user?.fullName || "U") +
                  "')",
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}
