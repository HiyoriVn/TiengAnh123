"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface PlacementResult {
  id: string;
  level: string;
  percentage: number;
  score: number;
  totalPoints: number;
  skillBreakdown: {
    LISTENING?: number;
    READING?: number;
    GRAMMAR?: number;
    VOCABULARY?: number;
  };
  completedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  level: string;
}

export default function StudentPlacementResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const resultRes = await api.get("/placement-test/my-result");
      if (!resultRes.data) {
        alert("Bạn chưa hoàn thành bài kiểm tra");
        router.push("/student/courses");
        return;
      }
      setResult(resultRes.data);

      const coursesRes = await api.get("/courses");
      const filtered = coursesRes.data.filter(
        (c: Course) => c.level === resultRes.data.level || c.level === "ALL"
      );
      setRecommendedCourses(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching result:", error);
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const getLevelDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      A1: "Bạn đang ở mức độ cơ bản. Có thể hiểu và sử dụng các cụm từ quen thuộc hàng ngày.",
      A2: "Bạn có nền tảng sơ cấp tốt. Có thể giao tiếp trong các tình huống đơn giản.",
      B1: "Bạn có nền tảng tốt để giao tiếp trong các tình huống quen thuộc.",
      B2: "Bạn có khả năng giao tiếp tốt trong nhiều tình huống khác nhau.",
      C1: "Bạn có khả năng sử dụng ngôn ngữ linh hoạt và hiệu quả.",
      C2: "Bạn đã thành thạo tiếng Anh, có thể hiểu và diễn đạt mọi thứ một cách dễ dàng.",
    };
    return descriptions[level] || "Chúc mừng bạn đã hoàn thành bài kiểm tra!";
  };

  const getSkillName = (skill: string) => {
    const names: Record<string, string> = {
      LISTENING: "Nghe",
      READING: "Đọc",
      GRAMMAR: "Ngữ pháp",
      VOCABULARY: "Từ vựng",
    };
    return names[skill] || skill;
  };

  const getSkillIcon = (skill: string) => {
    const icons: Record<string, string> = {
      LISTENING: "headphones",
      READING: "menu_book",
      GRAMMAR: "edit_note",
      VOCABULARY: "spellcheck",
    };
    return icons[skill] || "circle";
  };

  const getSkillColor = (percentage: number) => {
    if (percentage >= 80) return "bg-teal-blue";
    if (percentage >= 60) return "bg-primary";
    return "bg-orange-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-ocean-blue">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ocean-blue">Không tìm thấy kết quả</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Celebration Banner */}
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
          <span className="material-symbols-outlined text-6xl text-primary">
            emoji_events
          </span>
        </div>
        <h1 className="text-3xl font-bold text-deep-blue mb-2">
          Chúc mừng bạn đã hoàn thành!
        </h1>
        <p className="text-ocean-blue">
          Hoàn thành lúc: {new Date(result.completedAt).toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Result Card */}
      <section className="bg-white rounded-2xl shadow-lg border border-teal-blue/20 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Score Summary */}
          <div className="md:w-1/3 bg-gradient-to-br from-deep-blue to-ocean-blue p-8 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>

            <h3 className="text-soft-teal font-medium mb-6 relative z-10">
              Trình độ hiện tại
            </h3>

            <div className="relative size-40 mb-6 z-10">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                ></path>
                <path
                  className="text-peach drop-shadow-[0_0_10px_rgba(248,218,208,0.5)]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${result.percentage}, 100`}
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {result.level}
                </span>
                <span className="text-xs text-soft-teal mt-1">
                  {Math.round(result.percentage)}%
                </span>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed max-w-[200px] relative z-10">
              {getLevelDescription(result.level)}
            </p>

            <div className="mt-6 pt-6 border-t border-white/20 w-full relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-soft-teal">Điểm số:</span>
                <span className="font-bold">
                  {result.score} / {result.totalPoints}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Analytics */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-xl font-bold text-deep-blue mb-6">
              Chi tiết kỹ năng
            </h3>

            <div className="space-y-4 mb-8">
              {Object.entries(result.skillBreakdown).map(
                ([skill, percentage]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-ocean-blue flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          {getSkillIcon(skill)}
                        </span>
                        {getSkillName(skill)}
                      </span>
                      <span className="font-bold text-deep-blue">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div
                        className={`h-full ${getSkillColor(
                          percentage
                        )} rounded-full transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>

            {recommendedCourses.length > 0 && (
              <div className="bg-peach/20 rounded-xl p-5 border border-peach/50">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-4xl text-primary">
                      auto_awesome
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-deep-blue mb-1">
                      Lộ trình đề xuất cho bạn
                    </h4>
                    <p className="text-sm text-ocean-blue mb-3">
                      Dựa trên kết quả kiểm tra, chúng tôi gợi ý các khóa học
                      phù hợp với trình độ {result.level} của bạn.
                    </p>
                    <button
                      onClick={() => router.push("/student/courses")}
                      className="px-4 py-2 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Xem khóa học
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-deep-blue mb-6">
            Khóa học đề xuất
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all cursor-pointer"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: course.coverUrl
                        ? `url(${course.coverUrl})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-soft-teal text-ocean-blue text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {course.level}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-deep-blue font-bold text-lg leading-snug group-hover:text-teal-blue transition-colors mb-2">
                    {course.title}
                  </h4>
                  <p className="text-ocean-blue/80 text-sm line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  <button className="w-full h-9 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
