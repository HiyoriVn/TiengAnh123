"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { FileText, Video, Music, Trash2, Download, Search } from "lucide-react";

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: string;
  lesson: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export default function TeacherDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterType, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.lesson.course.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by file type
    if (filterType !== "all") {
      filtered = filtered.filter((doc) => {
        if (filterType === "pdf") return doc.fileType.includes("pdf");
        if (filterType === "video")
          return doc.fileType.includes("video") || doc.fileType.includes("mp4");
        if (filterType === "audio")
          return doc.fileType.includes("audio") || doc.fileType.includes("mp3");
        return true;
      });
    }

    setFilteredDocs(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;

    try {
      await api.delete(`/documents/${id}`);
      alert("Xóa tài liệu thành công!");
      fetchDocuments();
    } catch {
      alert("Lỗi khi xóa tài liệu");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FileText className="text-red-500" size={24} />;
    if (fileType.includes("video") || fileType.includes("mp4"))
      return <Video className="text-blue-500" size={24} />;
    if (fileType.includes("audio") || fileType.includes("mp3"))
      return <Music className="text-green-500" size={24} />;
    return <FileText className="text-gray-500" size={24} />;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("video") || fileType.includes("mp4")) return "Video";
    if (fileType.includes("audio") || fileType.includes("mp3")) return "Audio";
    return "File";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quản lý Tài liệu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý tất cả tài liệu bạn đã tải lên
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-navy rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, bài học, khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterType("pdf")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === "pdf"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setFilterType("video")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === "video"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setFilterType("audio")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === "audio"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Audio
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>
              Tổng số: <strong>{documents.length}</strong> tài liệu
            </span>
            <span>•</span>
            <span>
              Hiển thị: <strong>{filteredDocs.length}</strong> tài liệu
            </span>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white dark:bg-navy rounded-lg shadow-sm p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== "all"
                ? "Không tìm thấy tài liệu phù hợp"
                : "Chưa có tài liệu nào. Hãy tải lên tài liệu từ trang quản lý khóa học."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-navy rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                      {doc.fileName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-navy-light rounded text-xs font-medium">
                        {getFileTypeLabel(doc.fileType)}
                      </span>
                      <span>•</span>
                      <span className="truncate">
                        <strong>Khóa học:</strong> {doc.lesson.course.title}
                      </span>
                      <span>•</span>
                      <span className="truncate">
                        <strong>Bài học:</strong> {doc.lesson.title}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Tải xuống"
                    >
                      <Download size={20} />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
