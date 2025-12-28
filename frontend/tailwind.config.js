import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Quan trọng để hiển thị đúng chế độ tối/sáng
  theme: {
    extend: {
      colors: {
        primary: "#0C5776",
        "primary-dark": "#001C44",
        "primary-light": "#2D99AE",
        accent: "#F8DAD0",
        "accent-hover": "#f2c6b6",
        highlight: "#BCFEFE",
        "background-light": "#F4F7FA",
        "background-dark": "#001C44",
        "card-light": "#ffffff",
        "card-dark": "#0C5776",
        "text-main": "#001C44",
        "text-muted": "#4B647A",
        // --- Bảng màu CHUẨN cho Auth (Lấy từ trang Đăng ký) ---
        "brand-red": "#ee2b3b", // Màu đỏ chủ đạo (Nút bấm)
        "brand-blue": "#001C44", // Xanh đậm (Nền sidebar)
        "brand-teal": "#0C5776", // Xanh cổ vịt (Họa tiết)
        "brand-cyan": "#2D99AE", // Xanh sáng (Họa tiết)
        "brand-peach": "#F8DAD0", // Màu kem/hồng phấn (Text phụ)

        // --- Màu nền ---
        "bg-auth-light": "#f8f6f6", // Nền sáng
        "bg-auth-dark": "#221012", // Nền tối (pha đỏ nâu nhẹ theo mẫu đăng ký)
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};
