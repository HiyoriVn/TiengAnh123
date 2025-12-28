"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks";
import type { UserRole } from "@/lib/types";

/**
 * Menu items cho từng role
 */
const MENU_ITEMS: Record<
  UserRole,
  Array<{ icon: string; label: string; href: string }>
> = {
  STUDENT: [
    { icon: "dashboard", label: "Tổng quan", href: "/student/dashboard" },
    { icon: "school", label: "Khóa học của tôi", href: "/student/my-courses" },
    { icon: "explore", label: "Khám phá khóa học", href: "/student/courses" },
    {
      icon: "quiz",
      label: "Kiểm tra trình độ",
      href: "/student/placement-test",
    },
    { icon: "folder", label: "Thư viện tài liệu", href: "/student/documents" },
    {
      icon: "emoji_events",
      label: "Thành tích",
      href: "/student/achievements",
    },
  ],
  LECTURER: [
    { icon: "dashboard", label: "Tổng quan", href: "/teacher/dashboard" },
    { icon: "class", label: "Khóa học của tôi", href: "/teacher/courses" },
    {
      icon: "add_circle",
      label: "Tạo bài học",
      href: "/teacher/lessons/create",
    },
    {
      icon: "assignment",
      label: "Tạo bài tập",
      href: "/teacher/exercises/create",
    },
    {
      icon: "quiz",
      label: "Bài kiểm tra đầu vào",
      href: "/teacher/placement-test/create",
    },
    { icon: "group", label: "Học viên", href: "/teacher/students" },
    { icon: "folder", label: "Tài liệu", href: "/teacher/documents" },
    { icon: "grade", label: "Chấm điểm", href: "/teacher/grading" },
  ],
  ADMIN: [
    { icon: "dashboard", label: "Tổng quan", href: "/admin/dashboard" },
    { icon: "people", label: "Quản lý người dùng", href: "/admin/users" },
    { icon: "school", label: "Duyệt nội dung", href: "/admin/content" },
    { icon: "bar_chart", label: "Báo cáo", href: "/admin/reports" },
    { icon: "settings", label: "Cài đặt", href: "/admin/settings" },
  ],
};

/**
 * DashboardSidebar - Sidebar động theo user role
 */
export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout: authLogout } = useAuth();

  const handleLogout = () => {
    authLogout();
    router.push("/login");
  };

  if (!user) return null;

  const menuItems = MENU_ITEMS[user.role] || [];

  return (
    <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-gray-200 dark:border-primary/30 flex flex-col flex-shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-primary/30">
        <Link
          href="/"
          className="flex items-center gap-3 text-primary dark:text-ice"
        >
          <span className="material-symbols-outlined text-3xl">school</span>
          <h1 className="text-xl font-bold tracking-tight text-text-main-light dark:text-white">
            TiengAnh123
          </h1>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary dark:text-ice font-bold"
                  : "text-text-sub-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  isActive ? "fill-1" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button (Sticky Bottom) */}
      <div className="p-4 border-t border-gray-100 dark:border-primary/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
