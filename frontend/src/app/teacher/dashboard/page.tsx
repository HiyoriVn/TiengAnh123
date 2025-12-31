"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
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
import api from "@/utils/api";

interface TeacherStats {
  totalStudents: number;
  pendingGrading: number;
  activeCourses: number;
  avgRating: number;
}

interface Course {
  id: string;
  title: string;
  coverImage?: string;
  enrollments?: unknown[];
  lessons?: unknown[];
  isPublished?: boolean;
}

interface Submission {
  id: string;
  fileUrl: string;
  submittedAt: string;
  score?: number;
  comment?: string;
  student: {
    id: string;
    fullName: string;
  };
  assessment: {
    id: string;
    title: string;
    type: string;
  };
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function TeacherDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("Hôm nay...");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    pendingGrading: 0,
    activeCourses: 0,
    avgRating: 0,
  });

  const [quickActions] = useState<QuickAction[]>([
    {
      id: 1,
      title: "Tạo Khóa Học",
      description: "Tạo khóa học mới và thêm bài học",
      icon: "upload_file",
      href: "/teacher/courses/create",
    },
    {
      id: 2,
      title: "Tạo Bài Tập",
      description: "Thêm bài tập và đề kiểm tra",
      icon: "history_edu",
      href: "/teacher/exercises/create",
    },
    {
      id: 3,
      title: "Quản Lý Tài Liệu",
      description: "Đăng tải và quản lý tài liệu học tập",
      icon: "library_add",
      href: "/teacher/documents",
    },
  ]);

  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [gradingTasks, setGradingTasks] = useState<Submission[]>([]);

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

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch courses của giảng viên
      const coursesRes = await api.get("/courses/my-courses");
      const courses: Course[] = coursesRes.data;

      // Fetch submissions để lấy danh sách bài cần chấm
      // Lấy tất cả submissions chưa chấm (score === null)
      let allSubmissions: Submission[] = [];
      try {
        // Thử lấy submissions từ các assessment
        // Note: API này có thể cần điều chỉnh tùy backend
        const submissionsRes = await api.get("/submissions");
        allSubmissions = submissionsRes.data || [];
      } catch (error) {
        console.log("Could not fetch submissions:", error);
      }

      // Tính toán stats
      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.enrollments?.length || 0),
        0
      );

      const pendingSubmissions = allSubmissions.filter(
        (sub) => sub.score === null || sub.score === undefined
      );

      setStats({
        totalStudents,
        pendingGrading: pendingSubmissions.length,
        activeCourses: courses.filter((c: Course) => c.isPublished).length,
        avgRating: 4.8, // Tạm thời hardcode vì chưa có rating system
      });

      // Set recent courses (lấy 2 khóa học gần nhất)
      setRecentCourses(courses.slice(0, 2));

      // Set grading tasks (lấy 3 bài cần chấm gần nhất)
      setGradingTasks(pendingSubmissions.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading)
    return <div className="h-screen bg-background-dark" />;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-ice">
            Xin chào, {user?.fullName || "Giảng viên"}! 👋
          </h2>
          <p
            className="text-text-sub-light dark:text-text-sub-dark mt-1"
            suppressHydrationWarning
          >
            {currentDate}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-med/10 rounded-full -mr-12 -mt-12" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary text-sm font-medium">Học viên</p>
              <Users className="w-5 h-5 text-brand-blue-med" />
            </div>
            <h3 className="text-3xl font-bold text-primary">
              {stats.totalStudents.toLocaleString()}
            </h3>
            <p className="text-primary text-sm mt-2">Tổng học viên</p>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary text-sm font-medium">Cần chấm</p>
              <ClipboardCheck className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-primary">
              {stats.pendingGrading}
            </h3>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/10 rounded-full -mr-12 -mt-12" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary text-sm font-medium">Khóa học</p>
              <BookOpen className="w-5 h-5 text-brand-teal" />
            </div>
            <h3 className="text-3xl font-bold text-primary">
              {stats.activeCourses}
            </h3>
            <p className="text-primary text-sm mt-2">Đang hoạt động</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="bg-white hover:from-brand-peach/30 hover:to-orange-500/20 border border-brand-peach/20 p-6 rounded-xl text-left transition-all group block"
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
                <h3 className="text-primary font-semibold mb-1">
                  {action.title}
                </h3>
                <p className="text-primary text-sm">{action.description}</p>
              </div>
            </div>
          </Link>
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
              className="text-xs font-bold text-white hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {recentCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Chưa có khóa học nào</p>
                <Link
                  href="/teacher/courses/create"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Tạo khóa học đầu tiên
                </Link>
              </div>
            ) : (
              recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/teacher/courses/${course.id}`}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                >
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    {course.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-brand-teal" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-white">
                          {course.enrollments?.length || 0} học viên
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-white">
                          {course.lessons?.length || 0} bài học
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
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
            {gradingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không có bài nộp cần chấm</p>
              </div>
            ) : (
              gradingTasks.map((task) => {
                const timeDiff = Math.floor(
                  (Date.now() - new Date(task.submittedAt).getTime()) / 1000
                );
                const timeText =
                  timeDiff < 3600
                    ? `${Math.floor(timeDiff / 60)} phút trước`
                    : timeDiff < 86400
                    ? `${Math.floor(timeDiff / 3600)} giờ trước`
                    : `${Math.floor(timeDiff / 86400)} ngày trước`;

                return (
                  <Link
                    key={task.id}
                    href="/teacher/grading"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        task.assessment.type === "SPEAKING"
                          ? "bg-brand-teal"
                          : task.assessment.type === "WRITING"
                          ? "bg-orange-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white line-clamp-1">
                        {task.assessment.title}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {task.student.fullName}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {timeText}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            task.assessment.type === "SPEAKING"
                              ? "bg-brand-teal/10 text-brand-teal"
                              : task.assessment.type === "WRITING"
                              ? "bg-orange-500/10 text-orange-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {task.assessment.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
