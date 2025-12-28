"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Spinner } from "@/components/ui";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Thực hiện logout và redirect về trang chủ
    logout();

    // Đợi một chút để đảm bảo state được clear
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 500);

    return () => clearTimeout(timer);
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Đang đăng xuất...</p>
      </div>
    </div>
  );
}
