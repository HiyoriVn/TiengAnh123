"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getCourseById, checkEnrollment, enrollCourse } from "@/lib/api";
import type { CourseDetail } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { User, BookOpen, PlayCircle, CheckCircle } from "lucide-react";
import { Spinner } from "@/components/ui";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id || typeof id !== "string") return;

      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await getCourseById(
          id
        );

        if (courseError || !courseData) {
          setError("Không thể tải thông tin khóa học");
          return;
        }

        setCourse(courseData);

        // Check enrollment if user is logged in
        if (isAuthenticated) {
          const { data: enrollData } = await checkEnrollment(id);
          if (enrollData) {
            setIsEnrolled(enrollData.enrolled);
          }
        }
      } catch {
        setError("Đã có lỗi xảy ra khi tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!id || typeof id !== "string") return;

    setEnrolling(true);
    setError("");

    try {
      const { error: enrollError } = await enrollCourse(id);

      if (enrollError) {
        setError(enrollError.message || "Đăng ký thất bại");
        return;
      }

      setIsEnrolled(true);
    } catch {
      setError("Đã có lỗi xảy ra");
    } finally {
      setEnrolling(false);
    }
  };

  const handleLessonClick = () => {
    if (isEnrolled && course) {
      router.push(`/learn/${course.id}`);
    } else {
      // User hasn't enrolled yet
      // Could show a modal or toast here instead of alert
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            {error || "Không tìm thấy khóa học"}
          </p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-blue-100 mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <User size={16} /> GV: {course.creator?.fullName}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen size={16} /> {course.lessons?.length || 0} bài học
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="aspect-video bg-gray-200 mb-4 rounded flex items-center justify-center">
              {course.coverUrl ? (
                <img
                  src={course.coverUrl}
                  className="w-full h-full object-cover rounded"
                  alt={course.title}
                />
              ) : (
                <span className="text-gray-400 font-bold">No Image</span>
              )}
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-4 text-center">
              {formatCurrency(course.price)}
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            {isEnrolled ? (
              <button
                disabled
                className="w-full bg-green-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2"
              >
                <CheckCircle size={20} /> Đã sở hữu
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? "Đang xử lý..." : "Đăng ký học ngay"}
              </button>
            )}
            <p className="text-xs text-center text-gray-500 mt-3">
              Truy cập trọn đời • Học mọi lúc mọi nơi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
            <div className="space-y-3">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="text-gray-400" size={20} />
                      <span className="font-medium text-gray-700">
                        Bài {index + 1}: {lesson.title}
                      </span>
                    </div>
                    {/* --- ĐÂY LÀ CHỖ SỬA ONCLICK --- */}
                    <span
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={handleLessonClick}
                    >
                      {isEnrolled ? "Vào học" : "Xem trước"}
                    </span>
                    {/* ----------------------------- */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có bài học nào được cập nhật.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phần thông tin giảng viên (giữ nguyên) */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="font-bold text-lg mb-4">Thông tin giảng viên</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xl text-white">
                {course.creator?.fullName?.charAt(0) || "T"}
              </div>
              <div>
                <p className="font-bold">{course.creator?.fullName}</p>
                <p className="text-xs text-gray-500">Giảng viên Tiếng Anh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
