import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Bảng màu GỐC (Trang chủ & Auth) ---
        primary: "#0C5776", // Xanh đậm vừa
        "primary-dark": "#001C44", // Xanh tối
        "primary-light": "#2D99AE", // Xanh cổ vịt
        accent: "#F8DAD0", // Hồng phấn
        "accent-hover": "#f2c6b6",
        highlight: "#BCFEFE", // Xanh băng
        "text-main": "#001C44",
        "text-muted": "#4B647A",

        // --- Bảng màu AUTH (Login/Register) ---
        "brand-red": "#ee2b3b",
        "brand-blue": "#001C44",
        "brand-teal": "#0C5776",
        "brand-cyan": "#2D99AE",
        "brand-peach": "#F8DAD0",
        "bg-auth-light": "#f8f6f6",
        "bg-auth-dark": "#221012",

        // --- Bảng màu DASHBOARD (Hợp nhất từ 3 file HTML) ---
        // 1. Màu nền tối (Navy / Background Dark / Brand Blue) -> #001C44
        navy: "#001C44",
        "background-dark": "#001C44",

        // 2. Màu nền sáng (Background Light) -> #F4F7FA
        "background-light": "#F4F7FA",

        // 3. Màu Card/Khối (Primary / Surface Dark / Card Dark) -> #0C5776
        "surface-dark": "#0C5776",
        "card-dark": "#0C5776",

        // 4. Màu điểm nhấn (Secondary / Teal / Highlight) -> #2D99AE
        secondary: "#2D99AE",
        teal: "#2D99AE",

        // 5. Màu phụ trợ (Ice / Soft Blue) -> #BCFEFE
        ice: "#BCFEFE",
        "soft-blue": "#BCFEFE",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};
export default config;
