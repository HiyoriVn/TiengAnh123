"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // Import instance axios đã cấu hình

export default function LoginPage() {
  const router = useRouter();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý khi bấm nút Đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload trang
    setError("");
    setLoading(true);

    try {
      // 1. Gọi API đăng nhập từ Backend
      const response = await api.post("/auth/login", formData);

      // 2. Nếu thành công -> Lưu token vào LocalStorage
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_info", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));
      // 3. Chuyển hướng về trang chủ
      alert("Đăng nhập thành công!");
      router.push("/");
    } catch (err: any) {
      // Xử lý lỗi (ví dụ sai pass)
      console.error(err);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Đăng Nhập
        </h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập username..."
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Button Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
