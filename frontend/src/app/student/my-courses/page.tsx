"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { BookOpen, PlayCircle, Clock } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  level: string;
}

interface Enrollment {
  id: string;
  course: Course;
  progress: number;
  enrolledAt: string;
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments/my-courses");
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (courseId: string) => {
    router.push(`/learn/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-2 flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="text-primary" size={32} />
            </div>
            Khóa học của tôi
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Danh sách các khóa học bạn đã đăng ký
          </p>
        </div>

        {/* Courses Grid */}
        {enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Course Image */}
                <div
                  className="h-48 bg-gradient-to-br from-primary to-brand-medium bg-cover bg-center relative"
                  style={
                    enrollment.course.coverUrl
                      ? {
                          backgroundImage: `url('${enrollment.course.coverUrl}')`,
                        }
                      : undefined
                  }
                >
                  {!enrollment.course.coverUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="text-white/30" size={64} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary">
                      {enrollment.course.level || "A1"}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {enrollment.course.description ||
                      "Khóa học tiếng Anh chất lượng"}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Tiến độ
                      </span>
                      <span className="font-bold text-primary">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-brand-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        {new Date(enrollment.enrolledAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleContinueLearning(enrollment.course.id)}
                    className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18} />
                    Tiếp tục học
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-brand-medium shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-slate-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học và bắt
              đầu học ngay!
            </p>
            <button
              onClick={() => router.push("/student/courses")}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-lg inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">explore</span>
              Khám phá khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
