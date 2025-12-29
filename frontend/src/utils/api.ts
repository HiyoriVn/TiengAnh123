import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Địa chỉ Backend NestJS
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào Header trước khi gửi request
api.interceptors.request.use(
  (config) => {
    // Chúng ta sẽ lưu token vào localStorage với key là 'access_token'
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Xử lý response lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu lỗi 401 (Unauthorized) -> logout tự động
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
