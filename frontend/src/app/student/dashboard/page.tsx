"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/utils/api";

interface CourseData {
  id: number;
  title: string;
  coverUrl?: string;
  unit?: string;
  progress?: number;
}

interface UserState {
  fullName: string;
  role: string;
  avatar: string;
  points: number;
  streak: number;
}

const defaultUser: UserState = {
  fullName: "Học viên",
  role: "STUDENT",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
  points: 0,
  streak: 0,
};

export default function StudentDashboard() {
  const [user, setUser] = useState<UserState>(defaultUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_info");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          fullName: parsed.fullName ?? defaultUser.fullName,
          role: parsed.role ?? defaultUser.role,
          avatar: parsed.avatar ?? defaultUser.avatar,
          points: parsed.points ?? defaultUser.points,
          streak: parsed.streak ?? defaultUser.streak,
        });
      }
    } catch (err) {
      console.error("Failed to parse user_info", err);
    } finally {
      setMounted(true);
    }
  }, []);

  /* =======================
     DATE (CLIENT SAFE)
  ======================= */
  const [currentDate, setCurrentDate] = useState("Hôm nay...");

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "numeric",
      };
      setCurrentDate(`Hôm nay, ${now.toLocaleDateString("vi-VN", options)}`);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  /* =======================
     COURSE DATA
  ======================= */
  const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [studyTime] = useState([
    { day: "T2", percent: 30, isToday: false },
    { day: "T3", percent: 45, isToday: false },
    { day: "T4", percent: 60, isToday: true }, // Giả sử hôm nay là Thứ 4
    { day: "T5", percent: 20, isToday: false },
    { day: "T6", percent: 0, isToday: false },
    { day: "T7", percent: 80, isToday: false },
    { day: "CN", percent: 50, isToday: false },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get<CourseData[]>("/courses");
        if (!res.data?.length) return;

        const firstCourse = res.data[0];
        setActiveCourse({
          ...firstCourse,
          unit: "Bắt đầu ngay",
          progress: 0,
        });
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourses();
  }, []);

  /* =======================
     HYDRATION GUARD
  ======================= */
  if (!mounted) {
    return (
      <div className="h-screen bg-background-light dark:bg-background-dark" />
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display h-screen flex overflow-hidden transition-colors duration-200">
      {/* SIDEBAR (Giữ nguyên) */}
      <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-gray-200 dark:border-primary/30 flex-col hidden lg:flex flex-shrink-0 transition-colors duration-200">
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

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-ice text-primary font-bold"
          >
            <span className="material-symbols-outlined fill-1">dashboard</span>
            <span className="text-sm">Tổng quan</span>
          </Link>
          <Link
            href="/my-courses"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm font-medium">Khóa học của tôi</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">emoji_events</span>
            <span className="text-sm font-medium">Thành tích</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">leaderboard</span>
            <span className="text-sm font-medium">Bảng xếp hạng</span>
          </a>

          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-primary/30">
            <p className="px-3 text-xs font-semibold text-text-sub-light dark:text-text-sub-dark uppercase tracking-wider mb-2">
              Cài đặt
            </p>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Tài khoản</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-sub-light dark:text-text-sub-dark hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined">help</span>
              <span className="text-sm font-medium">Trợ giúp</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card-light dark:bg-card-dark border-b border-gray-200 dark:border-primary/30 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <button className="lg:hidden p-2 -ml-2 text-text-main-light dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-primary/20 text-text-sub-light dark:text-text-sub-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-accent ring-2 ring-white dark:ring-card-dark"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-primary/30">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-main-light dark:text-white">
                  {user.fullName}
                </p>
                <p className="text-xs text-text-sub-light dark:text-text-sub-dark">
                  Học viên
                </p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white dark:border-primary shadow-sm"
                style={{ backgroundImage: `url('${user.avatar}')` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-ice">
                  Chào mừng trở lại, {user.fullName.split(" ").pop()}! 👋
                </h2>
                <p className="text-text-sub-light dark:text-text-sub-dark mt-1">
                  Tiếp tục hành trình chinh phục Tiếng Anh Giao Tiếp hôm nay
                  nhé.
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark text-right">
                  {currentDate}
                </p>
              </div>
            </div>

            {/* ... (Phần nội dung Grid 12 cột giữ nguyên như cũ) ... */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 flex flex-col gap-6">
                {/* Xử lý hiển thị: Loading / Có khóa học / Không có khóa học */}
                {loadingCourse ? (
                  <div className="h-48 bg-gray-100 dark:bg-card-dark rounded-2xl animate-pulse flex items-center justify-center text-text-sub-light">
                    Đang tải khóa học...
                  </div>
                ) : activeCourse ? (
                  <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-primary/30 relative overflow-hidden group">
                    {/* ... (giữ nguyên phần background decoration) ... */}
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {/* Ảnh Thumbnail từ API */}
                      <div
                        className="w-full md:w-32 h-32 flex-shrink-0 rounded-xl bg-cover bg-center shadow-md border border-gray-100 dark:border-primary"
                        style={{
                          backgroundImage: `url('${
                            activeCourse.coverUrl ||
                            "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80"
                          }')`,
                        }}
                      ></div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="inline-block px-2 py-1 rounded bg-ice text-primary text-xs font-bold mb-2">
                              ĐANG HỌC
                            </span>
                            {/* Tên khóa học từ API */}
                            <h3 className="text-xl font-bold text-text-main-light dark:text-white">
                              {activeCourse.title}
                            </h3>
                          </div>
                        </div>
                        {/* ... (các phần khác giữ nguyên hoặc dùng activeCourse.unit/progress) ... */}

                        {/* Nút Học tiếp dẫn đến trang chi tiết */}
                        <div className="mt-5 flex gap-3">
                          <Link
                            href={`/learn/${activeCourse.id}`} // Link động theo ID khóa học
                            className="bg-accent hover:bg-[#F0C8BC] text-navy px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-accent/20"
                          >
                            <span>Học tiếp</span>
                            <span className="material-symbols-outlined text-lg">
                              arrow_forward
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Trường hợp chưa có khóa học nào
                  <div className="p-6 bg-white dark:bg-card-dark rounded-xl text-center border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="mb-4 text-text-sub-light dark:text-text-sub-dark">
                      Bạn chưa đăng ký khóa học nào.
                    </p>
                    <Link
                      href="/courses"
                      className="text-primary font-bold hover:underline"
                    >
                      Xem danh sách khóa học
                    </Link>
                  </div>
                )}

                {/* Skills */}
              </div>

              {/* RIGHT COLUMN */}
              <div className="xl:col-span-4 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Sửa phần hiển thị số liệu từ state user */}
                  <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-primary/30 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-navy mb-2">
                      <span className="material-symbols-outlined fill-1">
                        local_fire_department
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-text-main-light dark:text-white">
                      {user.streak} {/* Dùng biến user.streak */}
                    </span>
                    <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                      Ngày liên tiếp
                    </span>
                  </div>

                  <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-primary/30 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-ice flex items-center justify-center text-secondary mb-2">
                      <span className="material-symbols-outlined fill-1">
                        monetization_on
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-text-main-light dark:text-white">
                      {user.points.toLocaleString()}{" "}
                      {/* Dùng biến user.points */}
                    </span>
                    <span className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium">
                      Điểm thưởng
                    </span>
                  </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-primary/30 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-text-main-light dark:text-white">
                      Thời gian học
                    </h3>
                    <select className="text-xs bg-transparent border-none text-text-sub-light dark:text-text-sub-dark font-medium focus:ring-0 cursor-pointer">
                      <option>Tuần này</option>
                      <option>Tuần trước</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {studyTime.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2 w-full group cursor-pointer"
                      >
                        <div
                          className={`w-full max-w-[24px] rounded-t-sm transition-all relative group-hover:opacity-80
                            ${
                              item.isToday
                                ? "bg-accent shadow-[0_0_10px_rgba(248,218,208,0.5)]"
                                : "bg-ice/70 dark:bg-navy"
                            }`}
                          style={{ height: `${item.percent}%` }}
                        ></div>
                        <span
                          className={`text-[10px] font-medium ${
                            item.isToday
                              ? "text-primary dark:text-accent font-bold"
                              : "text-text-sub-light dark:text-text-sub-dark"
                          }`}
                        >
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-primary/30 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-main-light dark:text-white">
                      Huy hiệu mới
                    </h3>
                  </div>
                  {/* Trạng thái trống: Chưa có huy hiệu */}
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-navy rounded-full flex items-center justify-center mb-3 text-gray-400">
                      <span className="material-symbols-outlined text-3xl">
                        military_tech
                      </span>
                    </div>
                    <p className="text-sm text-text-sub-light dark:text-text-sub-dark font-medium">
                      Bạn chưa sở hữu huy hiệu nào
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hãy hoàn thành bài học để mở khóa!
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-navy to-primary rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                  <span className="material-symbols-outlined absolute -right-4 -top-4 text-8xl text-white opacity-5">
                    lightbulb
                  </span>
                  <h4 className="font-bold text-sm mb-2 relative z-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-accent">
                      tips_and_updates
                    </span>{" "}
                    Mẹo học tập
                  </h4>
                  <p className="text-xs text-blue-100 leading-relaxed relative z-10">
                    Hãy thử ghi âm lại giọng nói của bạn khi luyện Speaking để
                    tự đánh giá phát âm nhé!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
