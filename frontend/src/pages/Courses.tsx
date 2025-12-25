import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Định nghĩa dữ liệu khóa học từ API
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/courses");
        // Sắp xếp để khóa Cơ bản lên đầu, Nâng cao xuống cuối (nếu muốn)
        setCourses(response.data);
      } catch (error) {
        console.error("Lỗi tải khóa học:", error);
      }
    };
    fetchCourses();
  }, []);

  // HÀM HỖ TRỢ: Tạo dữ liệu giả lập cho giống Slide thiết kế
  // Vì Backend chưa có các trường này, ta tự hiển thị dựa theo tên khóa học
  const getCourseDetails = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cơ bản")) {
      return {
        lessons: 20,
        duration: "6 tuần",
        level: "Dễ",
        levelColor: "#28a745", // Màu xanh lá
        content: "Nghe – Nói – Đọc – Viết cơ bản",
      };
    } else if (t.includes("trung cấp")) {
      return {
        lessons: 25,
        duration: "8 tuần",
        level: "Trung bình",
        levelColor: "#ffc107", // Màu vàng
        content: "Nghe – Nói – Đọc – Viết nâng cao",
      };
    } else {
      return {
        lessons: 30,
        duration: "10 tuần",
        level: "Khó",
        levelColor: "#dc3545", // Màu đỏ
        content: "Academic English – Giao tiếp nâng cao",
      };
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header giống Slide */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              color: "#0056b3",
              textTransform: "uppercase",
              fontSize: "2.5rem",
              marginBottom: "10px",
            }}
          >
            Các Khóa Học Tiếng Anh
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Chọn khóa học phù hợp để bắt đầu hoặc nâng cao trình độ tiếng Anh
            của bạn.
          </p>
        </div>

        {/* Lưới khóa học */}
        <div
          style={{
            display: "grid",
            // Sửa 350px thành 280px để dễ chia 3 cột hơn
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // Giảm từ 350 xuống 280
            gap: "30px",
          }}
        >
          {courses.map((course) => {
            const details = getCourseDetails(course.title); // Lấy thông tin chi tiết giả lập

            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* Ảnh thumbnail */}
                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/png?text=Tieng+Anh+123";
                      e.currentTarget.onerror = null;
                    }}
                  />
                  {/* Badge Độ khó */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      backgroundColor: details.levelColor,
                      color: "white",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                  >
                    ⚡ {details.level}
                  </div>
                </div>

                {/* Nội dung card */}
                <div
                  style={{
                    padding: "25px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2
                    style={{
                      color: "#333",
                      fontSize: "1.5rem",
                      marginBottom: "15px",
                    }}
                  >
                    {course.title}
                  </h2>

                  {/* Các thông số kỹ thuật giống Slide */}
                  <div
                    style={{
                      marginBottom: "20px",
                      fontSize: "0.95rem",
                      color: "#555",
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>📘</span>
                      <strong>Nội dung:</strong> &nbsp;{details.content}
                    </p>
                    <p
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>❓</span>
                      <strong>Số bài học:</strong> &nbsp;{details.lessons} bài
                    </p>
                    <p
                      style={{
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>⏱</span>
                      <strong>Thời lượng:</strong> &nbsp;{details.duration}
                    </p>
                  </div>

                  {/* Mô tả ngắn */}
                  <p
                    style={{
                      color: "#777",
                      fontStyle: "italic",
                      marginBottom: "25px",
                      flex: 1,
                    }}
                  >
                    "{course.description}"
                  </p>

                  {/* Nút bấm */}
                  <button
                    onClick={() => navigate(`/lessons?courseId=${course.id}`)}
                    style={{
                      width: "100%",
                      padding: "15px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#0056b3")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#007bff")
                    }
                  >
                    BẮT ĐẦU HỌC ➜
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
