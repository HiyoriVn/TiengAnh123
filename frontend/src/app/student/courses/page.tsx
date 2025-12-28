"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  level: string;
  price: number;
  status: string;
  creator: {
    fullName: string;
  };
}

interface Enrollment {
  id: string;
  progress: number;
  course: Course;
}

interface PlacementResult {
  level: string;
  percentage: number;
  skillBreakdown: {
    LISTENING?: number;
    READING?: number;
    GRAMMAR?: number;
    VOCABULARY?: number;
  };
}

export default function StudentCoursesPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [placementResult, setPlacementResult] =
    useState<PlacementResult | null>(null);
  const [canTakeTest, setCanTakeTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch enrollments
      const enrollRes = await axios.get(
        "http://localhost:3000/enrollments/my-courses",
        config
      );
      setEnrollments(enrollRes.data);

      // Fetch all courses
      const coursesRes = await axios.get(
        "http://localhost:3000/courses",
        config
      );
      setAllCourses(
        coursesRes.data.filter((c: Course) => c.status === "PUBLISHED")
      );

      // Check placement test eligibility
      try {
        const placementRes = await axios.get(
          "http://localhost:3000/placement-test/my-result",
          config
        );
        setPlacementResult(placementRes.data);
        setCanTakeTest(false);
      } catch {
        // No result yet, check if can take test
        const eligibleRes = await axios.get(
          "http://localhost:3000/placement-test/check-eligibility",
          config
        );
        setCanTakeTest(eligibleRes.data.canTake);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedCourses = () => {
    if (!placementResult) return [];
    return allCourses
      .filter((c) => c.level === placementResult.level || c.level === "ALL")
      .slice(0, 3);
  };

  const filteredCourses = allCourses.filter((course) => {
    const levelMatch =
      selectedLevel === "ALL" || course.level === selectedLevel;
    return levelMatch;
  });

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-green-100 text-green-700",
      A2: "bg-blue-100 text-blue-700",
      B1: "bg-yellow-100 text-yellow-700",
      B2: "bg-orange-100 text-orange-700",
      C1: "bg-red-100 text-red-700",
      C2: "bg-purple-100 text-purple-700",
      ALL: "bg-gray-100 text-gray-700",
    };
    return colors[level] || colors.ALL;
  };

  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      A1: "Cơ bản (A1)",
      A2: "Sơ cấp (A2)",
      B1: "Trung cấp (B1)",
      B2: "Trung cấp cao (B2)",
      C1: "Nâng cao (C1)",
      C2: "Thành thạo (C2)",
      ALL: "Mọi trình độ",
    };
    return names[level] || level;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-ocean-blue">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-deep-blue tracking-tight">
            Khám phá khóa học
          </h1>
          <p className="text-ocean-blue mt-1">
            Tìm khóa học phù hợp với trình độ của bạn
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="text-deep-blue font-bold text-base mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                tune
              </span>
              Bộ lọc
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-ocean-blue uppercase tracking-wider mb-3">
                  Trình độ
                </p>
                <div className="space-y-2">
                  {["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === level}
                        onChange={() => setSelectedLevel(level)}
                        className="rounded-full border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-deep-blue group-hover:text-teal-blue">
                        {getLevelName(level)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Placement Result Card */}
          {placementResult && (
            <div className="bg-gradient-to-br from-deep-blue to-ocean-blue rounded-xl p-5 text-white shadow-lg border border-teal-blue/30">
              <div className="flex items-center justify-between mb-2">
                <span className="material-symbols-outlined text-3xl text-soft-teal opacity-80">
                  workspace_premium
                </span>
              </div>
              <h4 className="font-bold text-lg mb-1 text-soft-teal">
                Trình độ của bạn
              </h4>
              <p className="text-white/90 text-3xl font-bold mb-1">
                {placementResult.level}
              </p>
              <p className="text-soft-teal/80 text-sm mb-3">
                {Math.round(placementResult.percentage)}% điểm
              </p>
              <button
                onClick={() => router.push("/student/placement-test/result")}
                className="w-full bg-primary text-white text-sm font-bold py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Xem chi tiết
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Placement Test Banner */}
          {canTakeTest && enrollments.length === 0 && (
            <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <span className="material-symbols-outlined text-4xl">
                      assignment
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      Chào mừng đến với TiengAnh123!
                    </h3>
                    <p className="text-white/90 mb-4">
                      Hãy làm bài kiểm tra đánh giá trình độ để chúng tôi có thể
                      gợi ý khóa học phù hợp nhất cho bạn. Bài kiểm tra gồm 20
                      câu hỏi, thời gian 30 phút.
                    </p>
                    <button
                      onClick={() => router.push("/student/placement-test")}
                      className="bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">
                        play_arrow
                      </span>
                      <span>Bắt đầu kiểm tra</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Courses Section */}
          {enrollments.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-deep-blue mb-4">
                Khóa học của tôi
              </h2>
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      router.push(`/learn/${enrollment.course.id}`)
                    }
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-blue"></div>
                    <div
                      className="md:w-1/3 aspect-video md:aspect-auto rounded-lg bg-cover bg-center shrink-0 relative"
                      style={{
                        backgroundImage: enrollment.course.coverUrl
                          ? `url(${enrollment.course.coverUrl})`
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <div className="absolute top-2 left-2 bg-deep-blue/80 backdrop-blur-sm text-soft-teal text-xs font-bold px-2 py-1 rounded">
                        Đang học
                      </div>
                    </div>
                    <div className="flex flex-col justify-between flex-1 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-ocean-blue">
                          <span
                            className={`${getLevelColor(
                              enrollment.course.level
                            )} px-2 py-0.5 rounded text-xs font-bold`}
                          >
                            {enrollment.course.level}
                          </span>
                        </div>
                        <h3 className="text-deep-blue text-xl font-bold leading-tight group-hover:text-teal-blue transition-colors">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-ocean-blue text-sm line-clamp-2">
                          {enrollment.course.description}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end text-sm">
                          <span className="font-medium text-deep-blue">
                            Tiến độ hoàn thành
                          </span>
                          <span className="font-bold text-teal-blue">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="rounded-full bg-gray-200 h-2 w-full overflow-hidden">
                          <div
                            className="h-full bg-teal-blue rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <div className="pt-2">
                          <button className="bg-primary hover:bg-orange-600 text-white font-bold h-10 px-6 rounded-lg text-sm flex items-center justify-center gap-2 transition-all w-fit">
                            <span>Tiếp tục học</span>
                            <span className="material-symbols-outlined text-[18px]">
                              arrow_forward
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Courses */}
          {placementResult &&
            getRecommendedCourses().length > 0 &&
            enrollments.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-deep-blue mb-4">
                  Đề xuất cho bạn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getRecommendedCourses().map((course) => {
                    const isEnrolled = enrollments.some(
                      (e) => e.course.id === course.id
                    );
                    return (
                      <div
                        key={course.id}
                        className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          router.push(
                            isEnrolled
                              ? `/learn/${course.id}`
                              : `/courses/${course.id}`
                          )
                        }
                      >
                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{
                              backgroundImage: course.coverUrl
                                ? `url(${course.coverUrl})`
                                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          ></div>
                          <div className="absolute top-3 right-3 bg-soft-teal text-ocean-blue text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              recommend
                            </span>
                            Gợi ý
                          </div>
                          {isEnrolled && (
                            <div className="absolute top-3 left-3 bg-teal-blue text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                              Đã đăng ký
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1 gap-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-bold ${getLevelColor(
                                course.level
                              )} px-2 py-1 rounded`}
                            >
                              {course.level}
                            </span>
                          </div>
                          <h4 className="text-deep-blue font-bold text-lg leading-snug group-hover:text-teal-blue transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-ocean-blue/80 text-sm line-clamp-2 mb-auto">
                            {course.description}
                          </p>
                          <div className="mt-2 pt-3 border-t border-gray-100">
                            <button className="w-full h-9 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors">
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

          {/* All Courses */}
          <section>
            <h2 className="text-2xl font-bold text-deep-blue mb-4">
              Tất cả khóa học
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = enrollments.some(
                  (e) => e.course.id === course.id
                );
                return (
                  <div
                    key={course.id}
                    className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 cursor-pointer"
                    onClick={() =>
                      router.push(
                        isEnrolled
                          ? `/learn/${course.id}`
                          : `/courses/${course.id}`
                      )
                    }
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: course.coverUrl
                            ? `url(${course.coverUrl})`
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      ></div>
                      {isEnrolled && (
                        <div className="absolute top-3 left-3 bg-teal-blue text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          Đã đăng ký
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold ${getLevelColor(
                            course.level
                          )} px-2 py-1 rounded`}
                        >
                          {course.level}
                        </span>
                      </div>
                      <h4 className="text-deep-blue font-bold text-lg leading-snug group-hover:text-teal-blue transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-ocean-blue/80 text-sm line-clamp-2 mb-auto">
                        {course.description}
                      </p>
                      <div className="mt-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-ocean-blue mb-2">
                          <span>
                            Giảng viên: {course.creator?.fullName || "N/A"}
                          </span>
                        </div>
                        <button className="w-full h-9 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
