import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header"; // Import Header

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TiengAnh123 - Học tiếng Anh trực tuyến",
  description: "Nền tảng học tiếng Anh hiệu quả",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header /> {/* Gắn Header vào đây */}
        {children}
      </body>
    </html>
  );
}
