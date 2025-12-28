"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  lessons: Array<{
    id: string;
    title: string;
  }>;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id || typeof id !== "string") return;

      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);

        try {
          const enrollRes = await api.get(`/enrollments/check/${id}`);
          setIsEnrolled(enrollRes.data.enrolled);
        } catch {
          // Not logged in
        }
      } catch {
        setError("Không thể tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!id || typeof id !== "string") return;

    setEnrolling(true);
    setError("");

    try {
      await api.post("/enrollments", { courseId: id });
      setIsEnrolled(true);
      alert("Đăng ký thành công!");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
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
              <span>👤 GV: {course.creator?.fullName}</span>
              <span>📚 {course.lessons?.length || 0} bài học</span>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="aspect-video bg-gray-200 mb-4 rounded flex items-center justify-center">
              {course.coverUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
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
              {course.price.toLocaleString("vi-VN")} VNĐ
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
                {error}
              </div>
            )}

            {isEnrolled ? (
              <button
                disabled
                className="w-full bg-green-600 text-white py-3 rounded font-bold"
              >
                ✓ Đã sở hữu
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:opacity-50"
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
                      <span className="text-gray-400">▶</span>
                      <span className="font-medium text-gray-700">
                        Bài {index + 1}: {lesson.title}
                      </span>
                    </div>
                    {isEnrolled && (
                      <button
                        onClick={() => router.push(`/learn/${course.id}`)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Vào học
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Chưa có bài học nào.</p>
              )}
            </div>
          </div>
        </div>

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
