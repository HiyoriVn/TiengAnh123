"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

// 1. ĐỊNH NGHĨA INTERFACE
interface Student {
  fullName: string;
}

interface Submission {
  id: string;
  fileWork: string;
  score: number;
  comment: string;
  status: string; // SUBMITTED hoặc GRADED
  submitDate: string;
  student: Student;
}

interface GradeData {
  score: number;
  comment: string;
}

export default function GradingDashboard() {
  const TEST_ASSESSMENT_ID = "DIEN_ID_ASSESSMENT_CUA_BAN_VAO_DAY";

  // 2. ÁP DỤNG INTERFACE VÀO STATE
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState<GradeData>({
    score: 0,
    comment: "",
  });

  useEffect(() => {
    if (TEST_ASSESSMENT_ID) {
      api
        .get(`/submissions/assessment/${TEST_ASSESSMENT_ID}`)
        .then((res) => setSubmissions(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleGrade = async () => {
    if (!selectedSub) return;
    try {
      await api.patch(`/submissions/${selectedSub.id}/grade`, gradeData);
      alert("Chấm điểm thành công!");

      // Update lại danh sách cục bộ
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSub.id ? { ...s, ...gradeData, status: "GRADED" } : s
        )
      );

      // Update lại bài đang chọn để hiển thị kết quả mới
      setSelectedSub({ ...selectedSub, ...gradeData, status: "GRADED" });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu điểm");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 flex gap-8">
      {/* Cột trái: Danh sách bài nộp */}
      <div className="w-1/3 bg-white shadow rounded-lg p-4 h-screen overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Bài cần chấm</h2>
        {submissions.map((sub) => (
          <div
            key={sub.id}
            onClick={() => {
              setSelectedSub(sub);
              // Tự động điền điểm cũ vào form nếu đã chấm rồi
              setGradeData({
                score: sub.score || 0,
                comment: sub.comment || "",
              });
            }}
            className={`p-3 border-b cursor-pointer hover:bg-blue-50 ${
              selectedSub?.id === sub.id ? "bg-blue-100" : ""
            }`}
          >
            <p className="font-semibold">
              {sub.student?.fullName || "Học viên ẩn danh"}
            </p>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">
                {new Date(sub.submitDate).toLocaleDateString()}
              </span>
              <span
                className={`font-bold ${
                  sub.status === "GRADED" ? "text-green-600" : "text-orange-500"
                }`}
              >
                {sub.status === "GRADED" ? `${sub.score}đ` : "Chưa chấm"}
              </span>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="text-gray-500 italic">Chưa có bài nộp nào.</p>
        )}
      </div>

      {/* Cột phải: Form chấm */}
      <div className="w-2/3 bg-white shadow rounded-lg p-8">
        {selectedSub ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Chấm bài: {selectedSub.student?.fullName}
            </h2>

            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <p className="font-semibold mb-2">Bài làm:</p>
              <a
                href={selectedSub.fileWork}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-lg"
              >
                Xem bài làm (Click để mở)
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Điểm số (0-10)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={gradeData.score}
                  onChange={(e) =>
                    setGradeData({
                      ...gradeData,
                      score: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nhận xét</label>
                <textarea
                  className="w-full border p-2 rounded h-32"
                  value={gradeData.comment}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, comment: e.target.value })
                  }
                />
              </div>
              <button
                onClick={handleGrade}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Lưu kết quả
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Chọn một bài nộp bên trái để chấm
          </div>
        )}
      </div>
    </div>
  );
}
