"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

type TestStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface PlacementTest {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  status: TestStatus;
  createdAt: string;
  updatedAt: string;
}

export default function TeacherPlacementTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get("/placement-test/all");
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      alert("Không thể tải danh sách bài kiểm tra");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (testId: string, status: TestStatus) => {
    const confirmMessage =
      status === "ACTIVE"
        ? "Kích hoạt bài kiểm tra này? Tất cả các bài kiểm tra khác sẽ bị vô hiệu hóa."
        : status === "ARCHIVED"
        ? "Lưu trữ bài kiểm tra này?"
        : "Chuyển về bản nháp?";

    if (!confirm(confirmMessage)) return;

    try {
      await api.patch(`/placement-test/${testId}/status`, { status });
      alert("Cập nhật trạng thái thành công!");
      fetchTests();
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: TestStatus) => {
    const styles: Record<TestStatus, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      ACTIVE: "bg-green-100 text-green-800",
      ARCHIVED: "bg-orange-100 text-orange-800",
    };
    const labels: Record<TestStatus, string> = {
      DRAFT: "Bản nháp",
      ACTIVE: "Đang hoạt động",
      ARCHIVED: "Đã lưu trữ",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-muted">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-deep-blue">
            Quản lý bài kiểm tra đầu vào
          </h1>
          <p className="text-ocean-blue mt-1">
            Quản lý và kích hoạt bài kiểm tra đánh giá trình độ
          </p>
        </div>
        <button
          onClick={() => router.push("/teacher/placement-test/create")}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Tạo bài kiểm tra mới
        </button>
      </div>

      {/* Tests List */}
      {tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
            assignment
          </span>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Chưa có bài kiểm tra
          </h3>
          <p className="text-gray-500 mb-6">
            Tạo bài kiểm tra đầu vào để đánh giá trình độ học viên
          </p>
          <button
            onClick={() => router.push("/teacher/placement-test/create")}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Tạo bài kiểm tra đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-deep-blue">
                      {test.title}
                    </h3>
                    {getStatusBadge(test.status)}
                  </div>
                  <p className="text-text-muted text-sm mb-3">
                    {test.description}
                  </p>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        quiz
                      </span>
                      {test.totalQuestions} câu hỏi
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        schedule
                      </span>
                      {test.duration} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        calendar_today
                      </span>
                      {new Date(test.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {test.status === "DRAFT" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(test.id, "ACTIVE")}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        play_arrow
                      </span>
                      Kích hoạt
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(test.id, "ARCHIVED")}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        archive
                      </span>
                      Lưu trữ
                    </button>
                  </>
                )}

                {test.status === "ACTIVE" && (
                  <>
                    <div className="flex-1 flex items-center gap-2 text-green-600 font-semibold">
                      <span className="material-symbols-outlined animate-pulse">
                        check_circle
                      </span>
                      <span>Đang hoạt động - Học viên có thể làm bài</span>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(test.id, "ARCHIVED")}
                      className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        archive
                      </span>
                      Lưu trữ
                    </button>
                  </>
                )}

                {test.status === "ARCHIVED" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(test.id, "ACTIVE")}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        play_arrow
                      </span>
                      Kích hoạt lại
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(test.id, "DRAFT")}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                      Về bản nháp
                    </button>
                  </>
                )}
              </div>

              {test.status === "ACTIVE" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">💡 Lưu ý:</span> Chỉ có thể
                    có 1 bài kiểm tra hoạt động cùng lúc. Khi kích hoạt bài
                    khác, bài này sẽ tự động được lưu trữ.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 text-3xl">
            info
          </span>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Hướng dẫn sử dụng</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Bản nháp:</strong> Bài kiểm tra chưa sẵn sàng, học
                viên không thể làm
              </li>
              <li>
                • <strong>Đang hoạt động:</strong> Học viên có thể làm bài kiểm
                tra này
              </li>
              <li>
                • <strong>Đã lưu trữ:</strong> Bài kiểm tra cũ, không còn sử
                dụng
              </li>
              <li className="mt-2 pt-2 border-t border-blue-200">
                💡 <strong>Tip:</strong> Chỉ nên có 1 bài kiểm tra ACTIVE tại
                một thời điểm
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
