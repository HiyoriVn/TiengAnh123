"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import { PlayCircle, FileText, CheckCircle, ChevronRight } from "lucide-react";

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

interface Lesson {
  id: string;
  title: string;
  documents: Document[];
}

export default function LearningPage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        // Gọi API lấy chi tiết khóa học (bao gồm bài học)
        const res = await api.get(`/courses/${courseId}`);
        if (res.data.lessons && res.data.lessons.length > 0) {
          setLessons(res.data.lessons);
          setCurrentLesson(res.data.lessons[0]); // Mặc định chọn bài 1
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (courseId) fetchCourseContent();
  }, [courseId]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar bên trái: Danh sách bài học */}
      <div className="w-80 bg-white border-r overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b font-bold text-lg text-blue-800">
          Nội dung khóa học
        </div>
        <ul>
          {lessons.map((lesson, idx) => (
            <li
              key={lesson.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                currentLesson?.id === lesson.id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : ""
              }`}
              onClick={() => {
                setCurrentLesson(lesson);
                setActiveDoc(null); // Reset file đang xem khi đổi bài
              }}
            >
              <div className="font-medium text-gray-800 mb-1">
                Bài {idx + 1}: {lesson.title}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <PlayCircle size={12} /> {lesson.documents?.length || 0} tài
                liệu
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Khu vực chính: Màn hình học */}
      <div className="flex-1 flex flex-col">
        {currentLesson ? (
          <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              {currentLesson.title}
            </h1>

            {/* Khu vực hiển thị Video/Tài liệu */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-video mb-6 flex items-center justify-center relative">
              {activeDoc ? (
                activeDoc.fileType.includes("video") ? (
                  <video
                    src={activeDoc.filePath}
                    controls
                    className="w-full h-full"
                    autoPlay
                  />
                ) : (
                  <iframe
                    src={activeDoc.filePath}
                    className="w-full h-full bg-white"
                    title="Document Viewer"
                  ></iframe>
                )
              ) : (
                <div className="text-white text-center">
                  <p className="text-xl mb-2">
                    Chọn tài liệu bên dưới để bắt đầu học
                  </p>
                  <PlayCircle size={48} className="mx-auto opacity-50" />
                </div>
              )}
            </div>

            {/* Danh sách tài liệu của bài này */}
            <h3 className="font-bold text-lg mb-3">Tài liệu bài học</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLesson.documents?.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition ${
                    activeDoc?.id === doc.id
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="p-2 bg-gray-100 rounded text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{doc.fileName}</p>
                    <p className="text-xs text-gray-500 uppercase">
                      {doc.fileType.split("/")[1] || "FILE"}
                    </p>
                  </div>
                </div>
              ))}
              {(!currentLesson.documents ||
                currentLesson.documents.length === 0) && (
                <p className="text-gray-500 italic">
                  Bài học này chưa có tài liệu nào.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Đang tải nội dung...
          </div>
        )}
      </div>
    </div>
  );
}
