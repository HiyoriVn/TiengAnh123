"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

// 1. ĐỊNH NGHĨA TYPE RÕ RÀNG
interface Course {
  id: string;
  title: string;
  coverUrl?: string;
}

interface Enrollment {
  id: string;
  course: Course;
}

export default function MyCourses() {
  // 2. SỬ DỤNG TYPE THAY VÌ ANY
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    api
      .get("/enrollments/my-courses")
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Khóa học của tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrollments.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow bg-white"
          >
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              {item.course.coverUrl ? (
                <img
                  src={item.course.coverUrl}
                  className="w-full h-full object-cover"
                  alt={item.course.title}
                />
              ) : (
                <span className="text-gray-500">Khóa học</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">
                {item.course.title}
              </h3>
              <Link
                href={`/learn/${item.course.id}`}
                className="block text-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Tiếp tục học
              </Link>
            </div>
          </div>
        ))}
        {enrollments.length === 0 && (
          <p className="text-gray-500">Bạn chưa đăng ký khóa học nào.</p>
        )}
      </div>
    </div>
  );
}
