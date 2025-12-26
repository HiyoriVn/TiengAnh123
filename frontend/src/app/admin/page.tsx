"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { User, BookOpen, Check, X, Lock, Unlock } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  fullName: string;
  role: string;
  status: string; // ACTIVE, LOCKED
}

interface PendingLesson {
  id: string;
  title: string;
  course: {
    title: string;
    creator: {
      fullName: string;
    };
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "lessons">("users");
  const [users, setUsers] = useState<UserData[]>([]);
  const [pendingLessons, setPendingLessons] = useState<PendingLesson[]>([]);

  // --- SỬA LỖI TẠI ĐÂY ---
  // Đưa toàn bộ logic fetch dữ liệu vào trong useEffect
  useEffect(() => {
    const fetchData = async () => {
      // 1. Lấy Users
      try {
        const userRes = await api.get("/users");
        setUsers(userRes.data);
      } catch (err) {
        console.error("Lỗi tải users", err);
      }

      // 2. Lấy Bài học chờ duyệt
      try {
        const lessonRes = await api.get("/lessons/pending/all");
        setPendingLessons(lessonRes.data);
      } catch (err) {
        console.error("Lỗi tải bài học", err);
      }
    };

    fetchData();
  }, []); // Chỉ chạy 1 lần khi mount
  // ------------------------

  // Xử lý Khóa/Mở khóa User (US09)
  const toggleUserStatus = async (user: UserData) => {
    const newStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const confirmMsg =
      user.status === "ACTIVE"
        ? "Bạn muốn KHÓA tài khoản này?"
        : "Bạn muốn MỞ KHÓA tài khoản này?";

    if (!confirm(confirmMsg)) return;

    try {
      await api.patch(`/users/${user.id}/status`, { status: newStatus });
      // Cập nhật giao diện ngay lập tức (không cần gọi lại API)
      setUsers(
        users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  // Xử lý Duyệt bài (US10)
  const approveLesson = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(`/lessons/${id}/approve`, { status });
      // Xóa bài vừa xử lý khỏi danh sách chờ (không cần gọi lại API)
      setPendingLessons(pendingLessons.filter((l) => l.id !== id));
      alert(status === "APPROVED" ? "Đã duyệt bài!" : "Đã từ chối bài!");
    } catch (err) {
      alert("Lỗi xử lý");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Tabs chuyển đổi */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === "users"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("users")}
        >
          <User size={18} /> Quản lý Người dùng
        </button>
        <button
          className={`pb-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === "lessons"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("lessons")}
        >
          <BookOpen size={18} /> Duyệt bài học ({pendingLessons.length})
        </button>
      </div>

      {/* Tab Content: Users */}
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Họ tên</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.fullName}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "LECTURER"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role !== "ADMIN" && (
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white ${
                          user.status === "ACTIVE"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <Lock size={14} /> Khóa
                          </>
                        ) : (
                          <>
                            <Unlock size={14} /> Mở
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Lessons */}
      {activeTab === "lessons" && (
        <div className="grid gap-4">
          {pendingLessons.length === 0 ? (
            <p className="text-gray-500 italic">
              Không có bài học nào đang chờ duyệt.
            </p>
          ) : (
            pendingLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Khóa học: <strong>{lesson.course?.title}</strong>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Giảng viên: {lesson.course?.creator?.fullName}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => approveLesson(lesson.id, "APPROVED")}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Check size={18} /> Duyệt
                  </button>
                  <button
                    onClick={() => approveLesson(lesson.id, "REJECTED")}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    <X size={18} /> Từ chối
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
