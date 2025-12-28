"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  Star,
  TrendingUp,
  Upload,
  FileText,
  Library,
} from "lucide-react";

interface TeacherStats {
  totalStudents: number;
  pendingGrading: number;
  activeCourses: number;
  avgRating: number;
  studentTrend: number;
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function TeacherDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("Hôm nay...");

  const [stats] = useState<TeacherStats>({
    totalStudents: 1240,
    pendingGrading: 35,
    activeCourses: 8,
    avgRating: 4.9,
    studentTrend: 12,
  });

  const [quickActions] = useState<QuickAction[]>([
    {
      id: 1,
      title: "Thêm Bài Tập",
      description: "Tải lên bài tập kỹ năng Nghe, Nói, Đọc, Viết",
      icon: "upload_file",
    },
    {
      id: 2,
      title: "Tạo Bài Kiểm Tra",
      description: "Thiết kế đề thi và câu hỏi trắc nghiệm",
      icon: "history_edu",
    },
    {
      id: 3,
      title: "Thêm Tài Liệu",
      description: "Đăng tải tài liệu PDF, Video bài giảng",
      icon: "library_add",
    },
  ]);

  const [gradingTasks] = useState([
    {
      id: 1,
      title: "Bài tập Nói: Introduce yourself",
      studentName: "Nguyễn Văn A",
      time: "2 giờ trước",
      type: "Speaking",
      status: "Pending",
    },
    {
      id: 2,
      title: "Bài viết: Daily Routine",
      studentName: "Trần Thị B",
      time: "5 giờ trước",
      type: "Writing",
      status: "Pending",
    },
    {
      id: 3,
      title: "Bài tập Nói: Describe your house",
      studentName: "Lê Văn C",
      time: "1 ngày trước",
      type: "Speaking",
      status: "Pending",
    },
  ]);

  const [recentCourses] = useState([
    {
      id: 1,
      title: "Tiếng Anh Giao Tiếp Cơ Bản",
      thumbnail: "/images/course-speaking.jpg",
      students: 342,
      progress: 78,
    },
    {
      id: 2,
      title: "IELTS Writing Task 2",
      thumbnail: "/images/course-writing.jpg",
      students: 189,
      progress: 62,
    },
  ]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "numeric",
      };
      setCurrentDate(`Hôm nay, ${now.toLocaleDateString("vi-VN", options)}`);
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!mounted || authLoading)
    return <div className="h-screen bg-background-dark" />;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Xin chào, {user?.username || "Giảng viên"}! 👋
            </h2>
            <p className="text-gray-400 mt-1" suppressHydrationWarning>
              {currentDate}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-dark p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-med/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Học viên</p>
                <Users className="w-5 h-5 text-brand-blue-med" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.totalStudents.toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-sm font-medium">
                  +{stats.studentTrend}%
                </span>
                <span className="text-gray-500 text-sm">
                  so với tháng trước
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Cần chấm</p>
                <ClipboardCheck className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.pendingGrading}
              </h3>
              <div className="mt-2">
                <span className="text-orange-500 text-sm font-medium bg-orange-500/10 px-2 py-1 rounded">
                  Cao điểm
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Khóa học</p>
                <BookOpen className="w-5 h-5 text-brand-teal" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.activeCourses}
              </h3>
              <p className="text-gray-500 text-sm mt-2">Đang hoạt động</p>
            </div>
          </div>

          <div className="bg-surface-dark p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">Đánh giá</p>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {stats.avgRating.toFixed(1)}
                <span className="text-lg text-gray-400">/5.0</span>
              </h3>
              <p className="text-gray-500 text-sm mt-2">Trung bình</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="bg-gradient-to-br from-brand-peach/20 to-orange-500/10 hover:from-brand-peach/30 hover:to-orange-500/20 border border-brand-peach/20 p-6 rounded-xl text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-peach/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  {action.icon === "upload_file" && (
                    <Upload className="w-6 h-6 text-brand-peach" />
                  )}
                  {action.icon === "history_edu" && (
                    <FileText className="w-6 h-6 text-brand-peach" />
                  )}
                  {action.icon === "library_add" && (
                    <Library className="w-6 h-6 text-brand-peach" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Courses & Grading Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Courses */}
          <div className="bg-surface-dark p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Khóa học gần đây</h3>
              <Link
                href="/teacher/courses"
                className="text-xs font-bold text-brand-teal hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-med/20 to-brand-teal/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-brand-teal" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {course.students} học viên
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-blue-med to-brand-teal rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {course.progress}% hoàn thành
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Tasks */}
          <div className="bg-surface-dark p-6 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Bài tập cần chấm</h3>
              <Link
                href="/teacher/grading"
                className="text-xs font-bold text-brand-teal hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-3">
              {gradingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      task.type === "Speaking"
                        ? "bg-brand-teal"
                        : "bg-orange-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {task.title}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">
                        {task.studentName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {task.time}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          task.type === "Speaking"
                            ? "bg-brand-teal/10 text-brand-teal"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {task.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
