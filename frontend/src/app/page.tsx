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
              </div>
            </div>

            {/* Image placeholder - matching HTML template */}
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-highlight/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[120px] text-primary">
                    school
                  </span>
                </div>
              </div>
              <div className="absolute -z-10 -top-8 -right-8 size-32 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 size-32 bg-highlight rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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

      {/* --- COURSES SECTION --- */}
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

          <CourseGrid courses={courses || []} />

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
              className="h-14 px-8 rounded-lg bg-white text-primary-dark font-bold text-lg hover:bg-accent hover:text-primary-dark transition-colors shadow-xl inline-flex items-center justify-center"
            >
              Đăng ký ngay - Miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-primary-dark text-gray-300 py-16 dark:bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2023 TiengAnh123. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-gray-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
