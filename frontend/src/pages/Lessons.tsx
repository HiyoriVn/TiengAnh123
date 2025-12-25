import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
}

const Lessons = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId"); // Lấy ID khóa học từ URL
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      // Gọi API lấy danh sách bài học
      axios
        .get(`http://127.0.0.1:3000/lessons?courseId=${courseId}`)
        .then((res) => {
          setLessons(res.data);
          if (res.data.length > 0) setSelectedLesson(res.data[0]); // Mặc định chọn bài 1
        })
        .catch((err) => console.error(err));
    }
  }, [courseId]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* CỘT TRÁI: DANH SÁCH BÀI */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <button
          onClick={() => navigate("/courses")}
          style={{ marginBottom: "20px", cursor: "pointer" }}
        >
          ⬅ Quay lại
        </button>
        <h3>Mục lục bài học</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              style={{
                padding: "15px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor:
                  selectedLesson?.id === lesson.id ? "#e6f7ff" : "white",
                fontWeight:
                  selectedLesson?.id === lesson.id ? "bold" : "normal",
              }}
            >
              Bài {index + 1}: {lesson.title}
            </li>
          ))}
        </ul>
      </div>

      {/* CỘT PHẢI: NỘI DUNG VIDEO */}
      <div style={{ flex: 1, padding: "40px" }}>
        {selectedLesson ? (
          <div>
            <h1 style={{ color: "#007bff" }}>{selectedLesson.title}</h1>

            {/* Khung Video Youtube */}
            <div
              style={{
                margin: "20px 0",
                aspectRatio: "16/9",
                backgroundColor: "#000",
              }}
            >
              <iframe
                width="100%"
                height="100%"
                src={selectedLesson.videoUrl.replace("watch?v=", "embed/")}
                title="Video bài học"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
              }}
            >
              <h3>Nội dung bài học:</h3>
              <p>{selectedLesson.content}</p>
            </div>
          </div>
        ) : (
          <p>Chưa có bài học nào trong khóa này.</p>
        )}
      </div>
    </div>
  );
};

export default Lessons;
