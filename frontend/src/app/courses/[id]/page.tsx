"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import { User, BookOpen, PlayCircle, CheckCircle } from "lucide-react";

// 1. ĐỊNH NGHĨA TYPE (Không dùng any)
interface Lesson {
  id: string;
  title: string;
  duration?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  coverUrl?: string;
  creator: {
    fullName: string;
  };
  lessons: Lesson[];
}

interface UserInfo {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export default function CourseDetail() {
  const { id } = useParams();
  const router = useRouter(); // Dùng để chuyển trang

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userInfoStr =
      typeof window !== "undefined" ? localStorage.getItem("user_info") : null;
    let currentUser: UserInfo | null = null;

    if (userInfoStr) {
      currentUser = JSON.parse(userInfoStr);
      setUser(currentUser);
    }

    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        if (currentUser) {
          try {
            const checkRes = await api.get(`/enrollments/check/${id}`);
            setIsEnrolled(checkRes.data.enrolled);
          } catch (e) {
            console.log("Chưa đăng ký hoặc lỗi check");
          }
        }
      } catch (err) {
        console.error("Lỗi tải khóa học", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đăng ký khóa học!");
      router.push("/login");
      return;
    }

    if (!confirm("Bạn có chắc muốn đăng ký khóa học này?")) return;

    try {
      await api.post("/enrollments", { courseId: id });
      alert("Đăng ký thành công!");
      setIsEnrolled(true);
    } catch (err) {
      alert("Đăng ký thất bại. Có thể bạn đã đăng ký rồi.");
    }
  };

  // Hàm xử lý khi bấm vào bài học
  const handleLessonClick = () => {
    if (isEnrolled && course) {
      // Nếu đã đăng ký -> Chuyển sang trang học
      router.push(`/learn/${course.id}`);
    } else {
      // Nếu chưa -> Thông báo
      alert("Vui lòng đăng ký khóa học để xem nội dung này!");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  if (!course)
    return <div className="p-10 text-center">Không tìm thấy khóa học</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-blue-100 mb-6">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <User size={16} /> GV: {course.creator?.fullName}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen size={16} /> {course.lessons?.length || 0} bài học
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="aspect-video bg-gray-200 mb-4 rounded flex items-center justify-center">
              {course.coverUrl ? (
                <img
                  src={course.coverUrl}
                  className="w-full h-full object-cover rounded"
                  alt={course.title}
                />
              ) : (
                <span className="text-gray-400 font-bold">No Image</span>
              )}
            </div>

            <div className="text-3xl font-bold text-blue-600 mb-4 text-center">
              {course.price === 0
                ? "Miễn phí"
                : `${course.price.toLocaleString()} đ`}
            </div>

            {isEnrolled ? (
              <button className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 flex justify-center items-center gap-2">
                <CheckCircle size={20} /> Đã sở hữu
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition"
              >
                Đăng ký học ngay
              </button>
            )}
            <p className="text-xs text-center text-gray-500 mt-3">
              Truy cập trọn đời • Học mọi lúc mọi nơi
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
            <div className="space-y-3">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="text-gray-400" size={20} />
                      <span className="font-medium text-gray-700">
                        Bài {index + 1}: {lesson.title}
                      </span>
                    </div>
                    {/* --- ĐÂY LÀ CHỖ SỬA ONCLICK --- */}
                    <span
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={handleLessonClick}
                    >
                      {isEnrolled ? "Vào học" : "Xem trước"}
                    </span>
                    {/* ----------------------------- */}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có bài học nào được cập nhật.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phần thông tin giảng viên (giữ nguyên) */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="font-bold text-lg mb-4">Thông tin giảng viên</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xl text-white">
                {course.creator?.fullName?.charAt(0) || "T"}
              </div>
              <div>
                <p className="font-bold">{course.creator?.fullName}</p>
                <p className="text-xs text-gray-500">Giảng viên Tiếng Anh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
