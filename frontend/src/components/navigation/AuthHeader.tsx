"use client";

import Link from "next/link";
import { Book } from "lucide-react";

/**
 * AuthHeader - Header đơn giản cho login/register pages
 * Chỉ có logo + link về trang chủ
 */
export default function AuthHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 px-6 lg:px-10 py-4 bg-white dark:bg-bg-auth-dark sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="size-8 bg-brand-blue rounded-lg flex items-center justify-center text-white">
          <Book className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-brand-blue dark:text-white tracking-tight group-hover:text-brand-blue/80 transition-colors">
          TiengAnh123
        </span>
      </Link>

      <Link
        href="/"
        className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue transition-colors"
      >
        Trang chủ
      </Link>
    </header>
  );
}
