"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

// 1. Interface dữ liệu
interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
}

interface GradingTask {
  id: number;
  title: string;
  studentName: string;
  time: string;
  type: "Speaking" | "Writing";
  status: "Pending";
}

interface RecentFile {
  id: number;
  name: string;
  size: string;
  time: string;
  type: "Audio" | "Quiz" | "PDF";
  status: "Ready" | "Processing";
}

export default function TeacherDashboard() {
  // 2. State User (Mock)
  const defaultUser = useMemo(
    () => ({
      fullName: "Thầy Giáo Ba",
      role: "TEACHER",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=100&q=80",
    }),
    []
  );

  const [user, setUser] = useState(defaultUser);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("Hôm nay...");

  // 3. State Data (Đã BỎ THU NHẬP)
  const [stats] = useState<TeacherStats>({
    totalStudents: 1245,
    activeCourses: 8,
  });

  // Bài tập cần chấm (Dữ liệu mẫu)
  const [gradingTasks] = useState<GradingTask[]>([
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

  // Tài liệu mới tải lên (Dữ liệu mẫu từ HTML)
  const [recentFiles] = useState<RecentFile[]>([
    {
      id: 1,
      name: "Listening-Test-04.mp3",
      size: "14 MB",
      time: "5 giờ trước",
      type: "Audio",
      status: "Ready",
    },
    {
      id: 2,
      name: "Vocab-Unit-5-Quiz",
      size: "Trắc nghiệm",
      time: "Hôm qua",
      type: "Quiz",
      status: "Ready",
    },
    {
      id: 3,
      name: "Grammar-Review.pdf",
      size: "2.5 MB",
      time: "2 ngày trước",
      type: "PDF",
      status: "Processing",
    },
  ]);

  // 4. Effect: Khởi tạo dữ liệu an toàn (SSR-safe)
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      // Lấy User từ LocalStorage
      try {
        const stored = localStorage.getItem("user_info");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.role === "TEACHER") {
            setUser({
              fullName: parsed.fullName || defaultUser.fullName,
              role: parsed.role || defaultUser.role,
              avatar: parsed.avatar || defaultUser.avatar,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }

      // Set ngày tháng
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
  }, [defaultUser]);

  if (!mounted) return <div className="h-screen bg-background-dark" />;

  return (
    // Sử dụng đúng class màu từ HTML: background-dark (#001C44), surface-dark (#0C5776)
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-white font-display h-screen flex overflow-hidden transition-colors duration-200">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-white/10 flex-col hidden lg:flex flex-shrink-0 transition-colors duration-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-white/10">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-3xl">school</span>
            <h1 className="text-xl font-bold tracking-tight text-text-main-light dark:text-white">
              TiengAnh123
            </h1>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-bold"
          >
            <span className="material-symbols-outlined fill-1">dashboard</span>
            <span className="text-sm">Tổng quan</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">class</span>
            <span className="text-sm font-medium">Lớp học</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">quiz</span>
            <span className="text-sm font-medium">Ngân hàng câu hỏi</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Học viên</span>
          </a>
        </nav>
      </aside>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <button className="lg:hidden p-2 -ml-2 text-text-main-light dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex-1 hidden md:flex max-w-md mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-background-light dark:bg-background-dark text-sm focus:ring-2 focus:ring-primary/50 placeholder-gray-400 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p
                  className="text-sm font-bold text-text-main-light dark:text-white"
                  suppressHydrationWarning
                >
                  {user.fullName}
                </p>
                <p className="text-xs text-text-sub-light dark:text-gray-400">
                  Giảng viên
                </p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-primary shadow-sm"
                style={{ backgroundImage: `url('${user.avatar}')` }}
              ></div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-main-light dark:text-white">
                  Dashboard Giảng viên
                </h2>
                <p
                  className="text-text-sub-light dark:text-gray-400 mt-1"
                  suppressHydrationWarning
                >
                  {currentDate}
                </p>
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
                <span className="material-symbols-outlined text-lg">add</span>{" "}
                Tạo khóa học mới
              </button>
            </div>

            {/* Stats Cards (Đã bỏ Revenue) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-text-sub-light dark:text-gray-400 text-sm font-medium">
                    Tổng học viên
                  </p>
                  <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-1">
                    {stats.totalStudents.toLocaleString()}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-text-sub-light dark:text-gray-400 text-sm font-medium">
                    Khóa học Active
                  </p>
                  <h3 className="text-3xl font-bold text-text-main-light dark:text-white mt-1">
                    {stats.activeCourses}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">
                    library_books
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Biểu đồ + Bài tập cần chấm */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Area */}
              <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-text-main-light dark:text-white">
                    Thống kê Học viên mới
                  </h3>
                  <select className="text-xs bg-transparent border-none text-text-sub-light dark:text-gray-400 font-medium focus:ring-0 cursor-pointer">
                    <option>6 tháng qua</option>
                    <option>Năm nay</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-background-dark/50 rounded-lg border border-dashed border-gray-200 dark:border-white/10">
                  <div className="text-center text-text-sub-light dark:text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                      bar_chart
                    </span>
                    <p className="text-sm">Biểu đồ sẽ hiển thị tại đây</p>
                  </div>
                </div>
              </div>

              {/* Grading Tasks (Bài tập cần chấm) */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-text-main-light dark:text-white">
                    Bài tập cần chấm
                  </h3>
                  <Link
                    href="/teacher/grading"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {gradingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-gray-100 dark:border-white/5"
                    >
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${
                          task.type === "Speaking"
                            ? "bg-primary"
                            : "bg-orange-400"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text-main-light dark:text-white line-clamp-1">
                          {task.title}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-text-sub-light dark:text-gray-400">
                            {task.studentName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {task.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Files (Danh sách tài liệu) */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
              <h3 className="font-bold text-text-main-light dark:text-white mb-4">
                Tài liệu mới tải lên
              </h3>
              <div className="flex flex-col">
                {recentFiles.map((file, index) => {
                  // Logic chọn màu icon giống HTML mẫu
                  let iconColor = "bg-blue-500/10 text-blue-500";
                  let iconName = "headphones";
                  if (file.type === "Quiz") {
                    iconColor = "bg-purple-500/10 text-purple-500";
                    iconName = "quiz";
                  }
                  if (file.type === "PDF") {
                    iconColor = "bg-orange-500/10 text-orange-500";
                    iconName = "description";
                  }

                  return (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between py-3 ${
                        index !== recentFiles.length - 1
                          ? "border-b border-gray-100 dark:border-white/5"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}
                        >
                          <span className="material-symbols-outlined">
                            {iconName}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-text-main-light dark:text-white">
                            {file.name}
                          </h5>
                          <p className="text-xs text-text-sub-light dark:text-gray-400">
                            {file.size} • {file.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          file.status === "Ready"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {file.status === "Ready"
                          ? "check_circle"
                          : "radio_button_unchecked"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
