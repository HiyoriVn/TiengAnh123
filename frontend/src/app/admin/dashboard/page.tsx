"use client";

import { useAuth } from "@/hooks";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  pendingCourses: number;
  activeUsers: number;
  lockedUsers: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingCourses: 0,
    activeUsers: 0,
    lockedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, coursesRes] = await Promise.all([
        api.get("/users"),
        api.get("/courses/admin/all"), // Admin endpoint to get all courses
      ]);

      const users = usersRes.data;
      const courses = coursesRes.data;

      const totalEnrollments = courses.reduce(
        (sum: number, course: any) => sum + (course.enrollments?.length || 0),
        0
      );

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments,
        pendingCourses: courses.filter((c: any) => !c.isPublished).length,
        activeUsers: users.filter((u: any) => u.status === "ACTIVE").length,
        lockedUsers: users.filter((u: any) => u.status === "LOCKED").length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-ice">
          Chào mừng trở lại, {user?.fullName || "Admin"}! 👋
        </h2>
        <p className="text-text-sub-light dark:text-text-sub-dark mt-1">
          Đây là tổng quan tình hình hoạt động của hệ thống TiengAnh123.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users */}
            <div
              className="flex flex-col gap-4 rounded-xl p-6 bg-gradient-to-br from-brand-teal/20 to-brand-teal/5 border border-brand-teal/20 hover:border-brand-teal/40 shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
              onClick={() => router.push("/admin/users")}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="text-white w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 bg-brand-blue-med/20 rounded-xl flex items-center justify-center">
                  <Users className="text-brand-blue-med w-6 h-6" />
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="relative z-10">
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                  Tổng người dùng
                </p>
                <h3 className="text-4xl font-bold dark:text-text-sub-dark mb-2">
                  {stats.totalUsers.toLocaleString()}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                      {stats.activeUsers} hoạt động
                    </span>
                  </div>
                  {stats.lockedUsers > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                        {stats.lockedUsers} khóa
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Courses */}
            <div
              className="flex flex-col gap-4 rounded-xl p-6 bg-gradient-to-br from-brand-teal/20 to-brand-teal/5 border border-brand-teal/20 hover:border-brand-teal/40 shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
              onClick={() => router.push("/admin/content")}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen className="text-white w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 bg-brand-teal/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-brand-teal w-6 h-6" />
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="relative z-10">
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium mb-1">
                  Tổng khóa học
                </p>
                <h3 className="text-4xl font-bold dark:text-text-sub-dark mb-2">
                  {stats.totalCourses.toLocaleString()}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  {stats.pendingCourses > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                        {stats.pendingCourses} chờ duyệt
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Enrollments */}
            <div className="flex flex-col gap-4 rounded-xl p-6 bg-gradient-to-br from-brand-teal/20 to-brand-teal/5 border border-brand-teal/20 hover:border-brand-teal/40 shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserPlus className="text-white w-32 h-32" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 bg-brand-peach/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="text-brand-peach w-6 h-6" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                  Tổng lượt đăng ký
                </p>
                <h3 className="text-4xl font-bold dark:text-text-sub-dark mb-2">
                  {stats.totalEnrollments.toLocaleString()}
                </h3>
                <p className="text-text-sub-light dark:text-text-sub-dark text-xs">
                  Trung bình{" "}
                  {stats.totalCourses > 0
                    ? Math.round(stats.totalEnrollments / stats.totalCourses)
                    : 0}{" "}
                  đăng ký/khóa học
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-ice">
              Quản lý nhanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-6 rounded-xl bg-surface-dark border border-white/5 hover:border-brand-blue-med/40 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue-med/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-brand-blue-med w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Quản lý người dùng
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Phân quyền, khóa/mở tài khoản
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center justify-between p-6 rounded-xl bg-surface-dark border border-white/5 hover:border-brand-teal/40 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-teal/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="text-brand-teal w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Duyệt nội dung</h4>
                    <p className="text-gray-400 text-sm">
                      Phê duyệt khóa học từ giảng viên
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-gray-400 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
