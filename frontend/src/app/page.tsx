import Link from "next/link";
import { getCourses } from "@/lib/api";
import { CourseGrid } from "@/components/features";
import LandingPageHeader from "@/components/navigation/LandingPageHeader";

export default async function HomePage() {
  // Server-side fetch - SEO friendly, faster initial load
  const { data: courses } = await getCourses();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased overflow-x-hidden">
      {/* --- HEADER --- */}
      <LandingPageHeader />

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
                  Hơn 2,000+ học viên đã cải thiện trình độ
                </p>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-highlight/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white dark:bg-white/5 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-center h-full">
                    <span className="material-symbols-outlined text-[120px] text-primary">
                      school
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COURSES SECTION --- */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-primary-dark dark:text-white mb-4">
              Khóa học nổi bật
            </h2>
            <p className="text-lg text-text-muted dark:text-gray-300 max-w-2xl mx-auto">
              Chọn khóa học phù hợp với trình độ và mục tiêu của bạn
            </p>
          </div>

          <CourseGrid courses={courses || []} />

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex h-12 px-8 rounded-lg bg-white border border-gray-200 text-text-main font-bold text-base hover:bg-primary hover:text-white hover:border-primary transition-all items-center gap-2 dark:bg-white/5 dark:border-white/10 dark:text-white"
            >
              Xem tất cả khóa học
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 bg-brand-blue rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    school
                  </span>
                </div>
                <span className="text-xl font-bold">TiengAnh123</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng học tiếng Anh hiệu quả cho người Việt
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Liên kết</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white">
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Đăng nhập
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Điều khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chính sách
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 TiengAnh123. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
