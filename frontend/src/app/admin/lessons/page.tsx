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
  Clock,
  FileText,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  audioUrl: string | null;
  pdfUrl: string | null;
  orderIndex: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  course: {
    id: string;
    title: string;
    creator: {
      id: string;
      fullName: string;
      email: string;
    };
  };
}

export default function AdminLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    filterLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchTerm, lessons]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get("/lessons/admin/all");
      setLessons(response.data);
      setFilteredLessons(response.data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      alert("Không thể tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = [...lessons];

    // Status filter
    if (filter === "approved") {
      filtered = filtered.filter(
        (lesson) => lesson.approvalStatus === "APPROVED"
      );
    } else if (filter === "pending") {
      filtered = filtered.filter(
        (lesson) => lesson.approvalStatus === "PENDING"
      );
    } else if (filter === "rejected") {
      filtered = filtered.filter(
        (lesson) => lesson.approvalStatus === "REJECTED"
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lesson.course.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lesson.course.creator.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLessons(filtered);
  };

  const handleApprove = async (lessonId: string) => {
    if (!confirm("Bạn có chắc muốn duyệt bài học này?")) {
      return;
    }

    try {
      await api.patch(`/lessons/${lessonId}/approval`, {
        approvalStatus: "APPROVED",
      });
      alert("Duyệt bài học thành công!");
      fetchLessons();
    } catch (error) {
      console.error("Failed to approve lesson:", error);
      alert("Không thể duyệt bài học. Vui lòng thử lại.");
    }
  };

  const handleReject = async (lessonId: string) => {
    const reason = prompt("Nhập lý do từ chối (sẽ gửi cho giảng viên):");
    if (!reason) return;

    if (!confirm("Bạn có chắc muốn từ chối bài học này?")) {
      return;
    }

    try {
      await api.patch(`/lessons/${lessonId}/approval`, {
        approvalStatus: "REJECTED",
        rejectionReason: reason,
      });
      alert("Đã từ chối bài học và gửi thông báo cho giảng viên!");
      fetchLessons();
    } catch (error) {
      console.error("Failed to reject lesson:", error);
      alert("Không thể từ chối bài học. Vui lòng thử lại.");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      APPROVED: "bg-green-500/10 text-green-400",
      PENDING: "bg-yellow-500/10 text-yellow-400",
      REJECTED: "bg-red-500/10 text-red-400",
    };
    return (
      badges[status as keyof typeof badges] || "bg-gray-500/10 text-gray-400"
    );
  };

  const getStatusText = (status: string) => {
    const texts = {
      APPROVED: "Đã duyệt",
      PENDING: "Chờ duyệt",
      REJECTED: "Đã từ chối",
    };
    return texts[status as keyof typeof texts] || status;
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
        <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-ice">
          Duyệt bài học
        </h1>
        <p className="text-gray-400">Phê duyệt bài học từ giảng viên</p>
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
              placeholder="Tìm kiếm bài học, khóa học, giảng viên..."
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
              onClick={() => setFilter("pending")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "pending"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "approved"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Đã duyệt
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "rejected"
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Đã từ chối
            </button>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="bg-surface-dark border border-white/5 rounded-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Không tìm thấy bài học
          </h3>
          <p className="text-gray-400">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-surface-dark border border-white/5 rounded-lg hover:border-white/10 transition-all overflow-hidden p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {lesson.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        lesson.approvalStatus
                      )}`}
                    >
                      {getStatusText(lesson.approvalStatus)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    Khóa học:{" "}
                    <span className="text-brand-teal">
                      {lesson.course.title}
                    </span>
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{lesson.course.creator.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Bài {lesson.orderIndex}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>
                    {
                      [lesson.videoUrl, lesson.audioUrl, lesson.pdfUrl].filter(
                        Boolean
                      ).length
                    }{" "}
                    tài liệu
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-background-dark rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-300 line-clamp-3">
                  {lesson.content.replace(/<[^>]*>/g, "")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/student/lessons/${lesson.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
                {lesson.approvalStatus === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(lesson.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(lesson.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
