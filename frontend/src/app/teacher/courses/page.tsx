"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { Plus, Edit2, Eye, Users, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  price: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ALL";
  isPublished: boolean;
  _count?: {
    lessons: number;
    enrollments: number;
  };
  createdAt: string;
}

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses/my-courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (filter === "published") return course.isPublished;
    if (filter === "draft") return !course.isPublished;
    return true;
  });

  const getLevelBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      A1: "bg-green-100 text-green-800",
      A2: "bg-green-100 text-green-800",
      B1: "bg-yellow-100 text-yellow-800",
      B2: "bg-yellow-100 text-yellow-800",
      C1: "bg-red-100 text-red-800",
      C2: "bg-red-100 text-red-800",
      ALL: "bg-blue-100 text-blue-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các khóa học bạn đã tạo
          </p>
        </div>
        <button
          onClick={() => router.push("/teacher/courses/create")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Tất cả ({courses.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "published"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã xuất bản ({courses.filter((c) => c.isPublished).length})
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === "draft"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Bản nháp ({courses.filter((c) => !c.isPublished).length})
        </button>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-gray-500 mb-6">
            Bắt đầu tạo khóa học đầu tiên của bạn ngay hôm nay
          </p>
          <button
            onClick={() => router.push("/teacher/courses/create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Tạo khóa học mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                {course.coverImage ? (
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.isPublished
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {course.isPublished ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Level Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelBadge(
                      course.level
                    )}`}
                  >
                    {course.level}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course._count?.lessons || 0} bài học</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course._count?.enrollments || 0} học viên</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {course.price === 0
                      ? "Miễn phí"
                      : `${course.price.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/teacher/courses/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Xem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
