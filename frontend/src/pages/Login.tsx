import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gọi API đăng nhập của Backend
      const response = await axios.post("http://127.0.0.1:3000/auth/login", {
        email: email,
        password: password,
      });

      // Nếu thành công:
      console.log("Đăng nhập thành công!", response.data);

      // 1. Lưu Token vào bộ nhớ trình duyệt
      localStorage.setItem("access_token", response.data.access_token);

      // 2. Chuyển hướng sang trang Khóa học (Làm ở bước sau)
      alert("Đăng nhập thành công!");
      navigate("/courses");
    } catch (error: any) {
      alert("Đăng nhập thất bại! Kiểm tra lại email/pass.");
      console.error(error);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          border: "1px solid #ccc",
          padding: "40px",
          borderRadius: "10px",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Đăng nhập ngay
        </button>
      </form>
    </div>
  );
};

export default Login;
