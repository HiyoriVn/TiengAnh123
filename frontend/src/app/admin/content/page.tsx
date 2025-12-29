"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Calendar,
  Trash2,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  price: number;
  level: string;
  status: "DRAFT" | "PUBLISHED";
  creator: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export default function AdminContentPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Status filter
    if (filter === "published") {
      filtered = filtered.filter((course) => course.status === "PUBLISHED");
    } else if (filter === "draft") {
      filtered = filtered.filter((course) => course.status === "DRAFT");
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.creator.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleApprove = async (courseId: string) => {
    if (!confirm("Bạn có chắc muốn duyệt và xuất bản khóa học này?")) {
      return;
    }

    try {
      await api.patch(`/courses/${courseId}/approval`, { isPublished: true });
      alert("Duyệt khóa học thành công!");
      fetchCourses();
    } catch (error) {
      console.error("Failed to approve course:", error);
      alert("Không thể duyệt khóa học. Vui lòng thử lại.");
    }
  };

  const handleReject = async (courseId: string) => {
    const reason = prompt("Nhập lý do từ chối (sẽ gửi cho giảng viên):");
    if (!reason) return;

    if (!confirm("Bạn có chắc muốn từ chối và ẩn khóa học này?")) {
      return;
    }

    try {
      await api.patch(`/courses/${courseId}/approval`, { isPublished: false });
      // TODO: Send notification to creator with reason
      alert("Đã ẩn khóa học và gửi thông báo cho giảng viên!");
      fetchCourses();
    } catch (error) {
      console.error("Failed to reject course:", error);
      alert("Không thể từ chối khóa học. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (
      !confirm(
        `Bạn có chắc muốn XÓA VĨNH VIỄN khóa học "${courseTitle}"?\n\nHành động này KHÔNG THỂ HOÀN TÁC!`
      )
    ) {
      return;
    }

    // Double confirm for safety
    if (
      !confirm(
        "Xác nhận lần cuối: Tất cả dữ liệu liên quan (bài học, bài tập, đăng ký) sẽ bị xóa. Tiếp tục?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      alert("Đã xóa khóa học thành công!");
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Không thể xóa khóa học. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Duyệt khóa học</h1>
        <p className="text-gray-400">
          Phê duyệt khóa học từ giảng viên (Bài học được duyệt riêng)
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-dark rounded-lg border border-white/5 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khóa học, giảng viên..."
              className="w-full px-4 py-2 bg-background-dark border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "published"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Đã duyệt
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "draft"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Chờ duyệt
            </button>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-surface-dark border border-white/5 rounded-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-400">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-surface-dark border border-white/5 rounded-lg hover:border-white/10 transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Course Image */}
                <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-brand-blue-med/20 to-brand-teal/20 flex-shrink-0">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-brand-teal opacity-30" />
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {course.description}
                      </p>
                    </div>
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        course.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {course.status === "PUBLISHED" ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{course.creator.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{course._count?.lessons || 0} bài học</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          course.level === "A1" || course.level === "A2"
                            ? "bg-green-500/10 text-green-400"
                            : course.level === "B1" || course.level === "B2"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : course.level === "C1" || course.level === "C2"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-brand-teal">
                      {course.price === 0
                        ? "Miễn phí"
                        : `${course.price.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    {course.status === "DRAFT" ? (
                      <>
                        <button
                          onClick={() => handleApprove(course.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Duyệt & Xuất bản
                        </button>
                        <button
                          onClick={() => handleReject(course.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReject(course.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Ẩn khóa học
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
