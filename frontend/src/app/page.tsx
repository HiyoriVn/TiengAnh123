"use client"; // Báo cho NextJS biết đây là Client Component (để dùng được useEffect)

import { useEffect, useState } from "react";
import api from "@/utils/api"; // Import cái api vừa tạo

// Định nghĩa kiểu dữ liệu cho Khóa học (giống bên Backend)
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

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi trang vừa load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Lỗi lấy khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Danh sách khóa học
        </h1>

        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Ảnh bìa (Giả lập nếu null) */}
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  {course.coverUrl ? (
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-green-600 font-bold">
                      {course.price === 0
                        ? "Miễn phí"
                        : `${course.price.toLocaleString()} đ`}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      GV: {course.creator?.fullName || "Admin"}
                    </span>
                  </div>

                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
