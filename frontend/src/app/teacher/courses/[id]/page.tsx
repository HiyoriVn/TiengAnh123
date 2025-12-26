"use client";

import { useEffect, useState, ChangeEvent } from "react"; // Import thêm ChangeEvent
import { useParams } from "next/navigation";
import api from "@/utils/api";
import { Upload, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (Interface)
interface Document {
  id: string;
  fileName: string;
  filePath: string;
}

interface Lesson {
  id: string;
  title: string;
  approvalStatus: string;
  documents: Document[];
}

interface Course {
  id: string;
  title: string;
  status: string;
  lessons: Lesson[];
}

export default function CourseManagement() {
  const { id } = useParams();

  // 2. SỬ DỤNG KIỂU DỮ LIỆU ĐÃ ĐỊNH NGHĨA (Thay vì any)
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);
        if (courseRes.data.lessons) {
          setLessons(courseRes.data.lessons);
        }
      } catch (err) {
        console.error(err);
        alert("Không thể tải thông tin khóa học");
      }
    };
    if (id) fetchData();
  }, [id]);

  // 3. SỬA KIỂU DỮ LIỆU CỦA SỰ KIỆN (Event)
  // Thay e: any bằng e: ChangeEvent<HTMLInputElement>
  const handleUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    lessonId: string
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId);

    setUploading(true);
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload thành công!");
      window.location.reload();
    } catch (err) {
      alert("Lỗi khi upload file");
    } finally {
      setUploading(false);
    }
  };

  if (!course) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <span
          className={`px-3 py-1 rounded text-sm font-bold ${
            course.status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {course.status}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-4">Danh sách bài học</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  Trạng thái duyệt:
                  {lesson.approvalStatus === "APPROVED" && (
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-1" /> Đã duyệt
                    </span>
                  )}
                  {lesson.approvalStatus === "PENDING" && (
                    <span className="flex items-center text-yellow-600">
                      <Clock size={14} className="mr-1" /> Chờ duyệt
                    </span>
                  )}
                  {lesson.approvalStatus === "REJECTED" && (
                    <span className="flex items-center text-red-600">
                      <XCircle size={14} className="mr-1" /> Từ chối
                    </span>
                  )}
                </div>
              </div>

              <label
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition ${
                  uploading ? "opacity-50" : ""
                }`}
              >
                <Upload size={18} />
                <span className="text-sm font-medium">Tải tài liệu</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUpload(e, lesson.id)}
                  disabled={uploading}
                />
              </label>
            </div>

            {lesson.documents && lesson.documents.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Tài liệu đính kèm:
                </p>
                <div className="flex flex-wrap gap-2">
                  {lesson.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 text-blue-600"
                    >
                      <FileText size={14} />
                      {doc.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {lessons.length === 0 && (
          <p className="text-gray-500 italic">
            Chưa có bài học nào. Hãy tạo bài học bằng Postman trước.
          </p>
        )}
      </div>
    </div>
  );
}
