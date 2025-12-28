"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  coverUrl?: string;
  creator: {
    fullName: string;
  };
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Lỗi lấy khóa học", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased overflow-x-hidden">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 dark:bg-background-dark/90 dark:border-white/10 transition-all duration-300">
        <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 bg-brand-blue rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">
                  school
                </span>
              </div>
              <span className="text-xl font-bold text-brand-blue dark:text-white tracking-tight group-hover:text-brand-blue/80 transition-colors">
                TiengAnh123
              </span>
            </Link>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-6">
              {/* Desktop menu */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-colors"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/courses"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-colors"
                >
                  Khóa học
                </Link>
                <Link
                  href="#"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-colors"
                >
                  Lộ trình
                </Link>
              </nav>

              {/* Auth buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="h-10 px-6 rounded-lg border border-brand-blue text-brand-blue dark:text-white dark:border-white text-sm font-bold hover:bg-brand-blue hover:text-white dark:hover:bg-white dark:hover:text-brand-blue transition-all flex items-center justify-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="h-10 px-6 rounded-lg border border-brand-blue text-brand-blue dark:text-white dark:border-white text-sm font-bold hover:bg-brand-blue hover:text-white dark:hover:bg-white dark:hover:text-brand-blue transition-all flex items-center justify-center"
                >
                  Đăng ký
                </Link>
              </div>

              {/* Mobile menu button */}
              <button className="lg:hidden p-2 text-text-main hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-highlight via-white to-white dark:from-primary/30 dark:via-background-dark dark:to-background-dark opacity-60"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary-dark text-xs font-semibold w-fit mx-auto lg:mx-0 border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
                <span className="flex size-2 bg-green-500 rounded-full animate-pulse"></span>
                Nền tảng học tiếng Anh số 1 Việt Nam
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark tracking-tight leading-[1.15] dark:text-white">
                Học tiếng Anh <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                  Bài bản - Cá nhân hóa
                </span>
              </h1>
              <p className="text-lg text-text-muted max-w-xl mx-auto lg:mx-0 dark:text-gray-300">
                Chinh phục 4 kỹ năng Nghe, Nói, Đọc, Viết với lộ trình học tập
                thông minh AI dành riêng cho bạn. Cam kết hiệu quả sau 3 tháng.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/register"
                  className="h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                >
                  Bắt đầu học ngay
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">
                    arrow_forward
                  </span>
                </Link>
                <button className="h-12 px-8 rounded-lg bg-white border border-gray-200 text-text-main font-bold text-base hover:bg-highlight/50 hover:border-highlight hover:text-primary-dark transition-all flex items-center justify-center gap-2 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                  <span className="material-symbols-outlined text-primary">
                    assignment
                  </span>
                  Kiểm tra đầu vào
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 opacity-90">
                <div className="flex -space-x-3">
                  <div className="size-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"></div>
                  <div className="size-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"></div>
                  <div className="size-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"></div>
                  <div className="size-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    +2k
                  </div>
                </div>
                <p className="text-sm font-medium text-text-muted">
                  <span className="font-bold text-primary">500,000+</span> học
                  viên tin dùng
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent z-10"></div>
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  BANNER IMAGE
                </div>

                <div
                  className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg max-w-[180px] animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-green-500 text-xl">
                      check_circle
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      Hoàn thành bài học
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -top-8 -right-8 size-32 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 size-32 bg-highlight rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-10 bg-background-off border-y border-highlight/30 dark:bg-white/5 dark:border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <span className="text-3xl lg:text-4xl font-black text-primary">
                50+
              </span>
              <span className="text-sm font-medium text-text-muted">
                Khóa học đa dạng
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <span className="text-3xl lg:text-4xl font-black text-primary-light">
                10k+
              </span>
              <span className="text-sm font-medium text-text-muted">
                Bài tập tương tác
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <span className="text-3xl lg:text-4xl font-black text-orange-400">
                100+
              </span>
              <span className="text-sm font-medium text-text-muted">
                Giáo viên bản ngữ
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <span className="text-3xl lg:text-4xl font-black text-purple-400">
                24/7
              </span>
              <span className="text-sm font-medium text-text-muted">
                Hỗ trợ học tập
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 lg:py-28 bg-white dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4 dark:text-white">
              Tại sao chọn TiengAnh123?
            </h2>
            <p className="text-text-muted text-lg">
              Nền tảng học tập toàn diện kết hợp công nghệ AI giúp bạn tiến bộ
              vượt bậc mỗi ngày.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-highlight hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group dark:bg-white/5 dark:border-white/10 dark:hover:border-primary/30">
              <div className="size-12 rounded-lg bg-highlight/50 flex items-center justify-center text-primary-dark mb-5 group-hover:scale-110 transition-transform dark:bg-primary/20 dark:text-highlight">
                <span className="material-symbols-outlined text-[28px]">
                  schedule
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2 dark:text-white">
                Học mọi lúc mọi nơi
              </h3>
              <p className="text-text-muted text-sm leading-relaxed dark:text-gray-400">
                Truy cập bài học không giới hạn trên laptop, máy tính bảng hay
                điện thoại bất cứ khi nào bạn rảnh.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-highlight hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group dark:bg-white/5 dark:border-white/10 dark:hover:border-primary/30">
              <div className="size-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-5 group-hover:scale-110 transition-transform dark:bg-green-500/20 dark:text-green-400">
                <span className="material-symbols-outlined text-[28px]">
                  timeline
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2 dark:text-white">
                Lộ trình cá nhân hóa
              </h3>
              <p className="text-text-muted text-sm leading-relaxed dark:text-gray-400">
                AI phân tích trình độ và đề xuất bài học phù hợp nhất, giúp bạn
                không bị quá tải hay nhàm chán.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-highlight hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group dark:bg-white/5 dark:border-white/10 dark:hover:border-primary/30">
              <div className="size-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 mb-5 group-hover:scale-110 transition-transform dark:bg-orange-500/20 dark:text-orange-400">
                <span className="material-symbols-outlined text-[28px]">
                  hotel_class
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2 dark:text-white">
                Phát triển toàn diện
              </h3>
              <p className="text-text-muted text-sm leading-relaxed dark:text-gray-400">
                Cải thiện đồng đều 4 kỹ năng Nghe - Nói - Đọc - Viết qua các bài
                tập tương tác đa dạng.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-highlight hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group dark:bg-white/5 dark:border-white/10 dark:hover:border-primary/30">
              <div className="size-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-5 group-hover:scale-110 transition-transform dark:bg-purple-500/20 dark:text-purple-400">
                <span className="material-symbols-outlined text-[28px]">
                  videogame_asset
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2 dark:text-white">
                Học mà chơi
              </h3>
              <p className="text-text-muted text-sm leading-relaxed dark:text-gray-400">
                Hệ thống Gamification: tích điểm, đổi quà và đua top bảng xếp
                hạng giúp việc học thú vị hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- KHÓA HỌC NỔI BẬT --- */}
      <section className="py-20 lg:py-28 bg-background-off dark:bg-black/20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4 dark:text-white">
                Khóa học nổi bật
              </h2>
              <p className="text-text-muted text-lg max-w-xl">
                Lựa chọn cấp độ phù hợp để bắt đầu hành trình chinh phục tiếng
                Anh của bạn.
              </p>
            </div>
            {/* SỬA LỖI: Dùng Link cho nút Xem tất cả */}
            <Link
              href="/courses"
              className="hidden md:flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all hover:text-primary-dark"
            >
              Xem tất cả khóa học
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">
                Đang tải danh sách khóa học...
              </p>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full dark:bg-background-dark dark:border-white/10"
                >
                  <div className="h-40 bg-gray-200 relative overflow-hidden group">
                    {course.coverUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${course.coverUrl}')` }}
                      ></div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-500 group-hover:scale-110"></div>
                    )}
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                      {course.price === 0 ? "Miễn phí" : "Pro"}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4 line-clamp-3 flex-1 dark:text-gray-400">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          person
                        </span>{" "}
                        {course.creator?.fullName || "GV"}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          group
                        </span>{" "}
                        1.2k+
                      </span>
                    </div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="w-full py-2.5 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors text-center block"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-10 bg-white rounded-lg border border-dashed">
                Chưa có khóa học nào. Hãy vào Admin/Teacher để tạo.
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-primary font-bold"
            >
              Xem tất cả khóa học
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Sẵn sàng để giỏi Tiếng Anh?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Tham gia cùng cộng đồng hơn 500.000 học viên và bắt đầu hành trình
            chinh phục ngôn ngữ ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="h-14 px-8 rounded-lg bg-white text-primary-dark font-bold text-lg hover:bg-accent hover:text-primary-dark transition-colors shadow-xl flex items-center justify-center"
            >
              Đăng ký ngay - Miễn phí
            </Link>
            <button className="h-14 px-8 rounded-lg bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-colors">
              Tư vấn lộ trình
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-primary-dark text-gray-300 py-16 dark:bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 bg-primary rounded text-white">
                  <span className="material-symbols-outlined text-[20px]">
                    school
                  </span>
                </div>
                <span className="text-xl font-bold text-white">
                  TiengAnh123
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Nền tảng học tiếng Anh trực tuyến hàng đầu Việt Nam.
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  className="text-gray-400 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined">
                    social_leaderboard
                  </span>
                </a>
                <a
                  className="text-gray-400 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined">
                    smart_display
                  </span>
                </a>
                <a
                  className="text-gray-400 hover:text-white transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined">mail</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Về TiengAnh123</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Học tập</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Khóa học
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Luyện thi
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Tiếng Anh giao tiếp
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary-light transition-colors"
                    href="#"
                  >
                    Blog chia sẻ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Liên hệ</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5 text-primary-light">
                    location_on
                  </span>
                  <span>Tầng 5, Tòa nhà ABC, Hà Nội</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-light">
                    call
                  </span>
                  <span>1900 123 456</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-light">
                    email
                  </span>
                  <span>hotro@tienganh123.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2023 TiengAnh123. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="hover:text-gray-300" href="#">
                Privacy Policy
              </Link>
              <Link className="hover:text-gray-300" href="#">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
