"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Hàm kiểm tra user từ storage
    const checkUser = () => {
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    };

    // Chạy lần đầu khi load trang
    checkUser();

    // 2. Lắng nghe sự kiện "auth-change" (từ trang Login bắn sang)
    window.addEventListener("auth-change", checkUser);

    // Dọn dẹp khi component bị hủy (tránh rò rỉ bộ nhớ)
    return () => {
      window.removeEventListener("auth-change", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");

    // Cũng phát tín hiệu để Header tự xóa tên user ngay lập tức
    window.dispatchEvent(new Event("auth-change"));

    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TiengAnh123
        </Link>

        {/* Menu bên phải */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">
                Chào, <strong>{user.fullName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
