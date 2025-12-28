"use client";

import { useAuth } from "@/hooks";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalUsers: number;
  onlineStudents: number;
  newRegistrations: number;
  userTrend: number;
  onlineTrend: number;
  regTrend: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats] = useState<Stats>({
    totalUsers: 12450,
    onlineStudents: 856,
    newRegistrations: 124,
    userTrend: 12.5,
    onlineTrend: 8.2,
    regTrend: -3.1,
  });

  useEffect(() => {
    // TODO: Fetch real data from API when integrated with backend
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-white tracking-tight text-2xl md:text-3xl font-bold leading-tight">
            Chào mừng trở lại, {user?.fullName || "Admin"}! 👋
          </h2>
          <p className="text-brand-teal-light/70 text-sm">
            Đây là tổng quan tình hình hoạt động của hệ thống TiengAnh123 hôm
            nay.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Users */}
          <div className="flex flex-col gap-2 rounded-xl p-5 bg-brand-blue-med border border-brand-teal/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="text-brand-teal-light w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-brand-blue-dark rounded-lg text-brand-peach">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-brand-teal-light/80 text-sm font-medium">
                Tổng người dùng
              </p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-white text-3xl font-bold leading-none">
                {stats.totalUsers.toLocaleString()}
              </p>
              <span
                className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded mb-1 ${
                  stats.userTrend >= 0
                    ? "text-[#0bda92] bg-[#0bda92]/10"
                    : "text-brand-peach bg-brand-peach/10"
                }`}
              >
                {stats.userTrend >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                )}
                {Math.abs(stats.userTrend)}%
              </span>
            </div>
          </div>

          {/* Online Students */}
          <div className="flex flex-col gap-2 rounded-xl p-5 bg-brand-blue-med border border-brand-teal/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="text-brand-teal-light w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-brand-blue-dark rounded-lg text-brand-peach">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-brand-teal-light/80 text-sm font-medium">
                Học viên Online
              </p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-white text-3xl font-bold leading-none">
                {stats.onlineStudents.toLocaleString()}
              </p>
              <span
                className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded mb-1 ${
                  stats.onlineTrend >= 0
                    ? "text-[#0bda92] bg-[#0bda92]/10"
                    : "text-brand-peach bg-brand-peach/10"
                }`}
              >
                {stats.onlineTrend >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                )}
                {Math.abs(stats.onlineTrend)}%
              </span>
            </div>
          </div>

          {/* New Registrations */}
          <div className="flex flex-col gap-2 rounded-xl p-5 bg-brand-blue-med border border-brand-teal/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserPlus className="text-brand-teal-light w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-brand-blue-dark rounded-lg text-brand-peach">
                <UserPlus className="w-5 h-5" />
              </div>
              <p className="text-brand-teal-light/80 text-sm font-medium">
                Đăng ký mới
              </p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-white text-3xl font-bold leading-none">
                {stats.newRegistrations.toLocaleString()}
              </p>
              <span
                className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded mb-1 ${
                  stats.regTrend >= 0
                    ? "text-[#0bda92] bg-[#0bda92]/10"
                    : "text-brand-peach bg-brand-peach/10"
                }`}
              >
                {stats.regTrend >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                )}
                {Math.abs(stats.regTrend)}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Hoạt động gần đây</h3>
          <div className="rounded-xl bg-brand-blue-med border border-brand-teal/20 p-8 text-center">
            <p className="text-gray-400">
              Dữ liệu hoạt động sẽ được hiển thị tại đây
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
